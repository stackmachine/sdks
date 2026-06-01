import RelayRuntime, { type Environment } from "relay-runtime";
const { graphql, fetchQuery } = RelayRuntime;
import type {
  StackMachineCacheConfig,
  StackMachineRequestOptions,
} from "./environment";
import {
  StackMachineAPIError,
  StackMachineConnectionError,
  StackMachineValidationError,
  stackMachineErrorFromUnknown,
} from "./errors";
import {
  BlobReader,
  BlobWriter,
  TextReader,
  Uint8ArrayReader,
  ZipWriter,
} from "@zip.js/zip.js";
import { uploadQuery } from "__generated__/uploadQuery.graphql";

const DEFAULT_CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks
const MAX_CHUNK_SIZE = 512 * 1024 * 1024;

const RETRYABLE_UPLOAD_STATUS_CODES = new Set([
  408, 409, 425, 429, 500, 502, 503, 504,
]);

export type StackMachineUploadOptions = StackMachineRequestOptions & {
  chunkSize?: number;
  onProgress?: (progress: StackMachineUploadProgress) => void;
};

export type StackMachineUploadProgress = {
  loaded: number;
  total: number;
  percent: number;
};

export type StackMachineZipFile =
  | Blob
  | string
  | Uint8Array
  | ReadableStream
  | File;

export type StackMachineZipFiles = {
  [key: string]: StackMachineZipFile;
};

export type StackMachineResolvedUploadOptions = StackMachineUploadOptions & {
  fetch: typeof fetch;
  timeout: number;
  maxNetworkRetries: number;
  chunkSize: number;
};

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function isRetryableUploadStatus(statusCode?: number): boolean {
  return (
    statusCode !== undefined && RETRYABLE_UPLOAD_STATUS_CODES.has(statusCode)
  );
}

function validateChunkSize(value: number | undefined): number {
  const chunkSize = value ?? DEFAULT_CHUNK_SIZE;
  if (
    !Number.isInteger(chunkSize) ||
    chunkSize < 1 ||
    chunkSize > MAX_CHUNK_SIZE
  ) {
    throw new StackMachineValidationError({
      message: `\`chunkSize\` must be an integer between 1 and ${MAX_CHUNK_SIZE} bytes.`,
      code: "invalid_upload_chunk_size",
      param: "chunkSize",
    });
  }
  return chunkSize;
}

function validateUploadFile(file: Blob) {
  if (!file || typeof file.size !== "number" || file.size < 0) {
    throw new StackMachineValidationError({
      message: "`file` must be a Blob-like object with a valid size.",
      code: "invalid_upload_file",
      param: "file",
    });
  }
}

export function resolveUploadOptions(
  options: StackMachineUploadOptions | undefined,
  defaults: {
    fetch: typeof fetch;
    timeout: number;
    maxNetworkRetries: number;
  },
): StackMachineResolvedUploadOptions {
  return {
    ...options,
    fetch: defaults.fetch,
    timeout: options?.timeout ?? defaults.timeout,
    maxNetworkRetries: options?.maxNetworkRetries ?? defaults.maxNetworkRetries,
    chunkSize: validateChunkSize(options?.chunkSize),
  };
}

function createUploadSignal(
  signal?: AbortSignal,
  timeout?: number,
): {
  signal?: AbortSignal;
  cleanup: () => void;
  timedOut: () => boolean;
  userAborted: () => boolean;
} {
  if (!signal && (!timeout || timeout <= 0)) {
    return {
      signal: undefined,
      cleanup: () => {},
      timedOut: () => false,
      userAborted: () => false,
    };
  }

  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let timedOut = false;
  let userAborted = false;

  const abortFromSignal = () => {
    userAborted = true;
    controller.abort(signal?.reason);
  };

  if (signal) {
    if (signal.aborted) {
      abortFromSignal();
    } else {
      signal.addEventListener("abort", abortFromSignal, { once: true });
    }
  }

  if (timeout && timeout > 0) {
    timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort(new Error(`Upload timed out after ${timeout}ms.`));
    }, timeout);
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      signal?.removeEventListener("abort", abortFromSignal);
    },
    timedOut: () => timedOut,
    userAborted: () => userAborted,
  };
}

function uploadConnectionError(
  error: unknown,
  operationName: string,
  signal?: ReturnType<typeof createUploadSignal>,
): StackMachineConnectionError {
  const userAborted = signal?.userAborted() ?? false;
  const timedOut = signal?.timedOut() ?? false;
  return new StackMachineConnectionError({
    message: userAborted
      ? "StackMachine upload was aborted."
      : timedOut
        ? "StackMachine upload timed out."
        : error instanceof Error
          ? error.message
          : "StackMachine upload failed.",
    operationName,
    code: userAborted
      ? "request_aborted"
      : timedOut || isAbortError(error)
        ? "request_timeout"
        : undefined,
    cause: error,
  });
}

function uploadApiError(
  response: Response,
  operationName: string,
  fallback: string,
) {
  return new StackMachineAPIError({
    message: `${fallback}: ${response.statusText || response.status}`,
    operationName,
    statusCode: response.status,
  });
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function retryDelayMs(attempt: number): number {
  const base = Math.min(100 * 2 ** attempt, 2_000);
  return Math.round(base / 2 + Math.random() * (base / 2));
}

function shouldRetryUploadError(
  error: unknown,
  attempt: number,
  maxRetries: number,
): boolean {
  if (attempt >= maxRetries) {
    return false;
  }
  if (
    error instanceof StackMachineConnectionError &&
    error.code !== "request_aborted"
  ) {
    return true;
  }
  if (error instanceof StackMachineAPIError) {
    return isRetryableUploadStatus(error.statusCode);
  }
  return false;
}

async function retryUploadRequest<T>(
  operationName: string,
  options: StackMachineResolvedUploadOptions,
  request: () => Promise<T>,
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await request();
    } catch (error) {
      if (!shouldRetryUploadError(error, attempt, options.maxNetworkRetries)) {
        throw error;
      }
      await sleep(retryDelayMs(attempt));
      attempt += 1;
    }
  }
}

async function uploadFetch(
  url: string,
  init: RequestInit,
  operationName: string,
  options: StackMachineResolvedUploadOptions,
): Promise<Response> {
  const signal = createUploadSignal(options.signal, options.timeout);
  try {
    return await options.fetch(url, {
      ...init,
      signal: signal.signal,
    });
  } catch (error) {
    throw uploadConnectionError(error, operationName, signal);
  } finally {
    signal.cleanup();
  }
}

function uploadedBytesFromRange(rangeHeader: string | null): number | null {
  if (!rangeHeader) {
    return null;
  }
  const match = /bytes=0-(\d+)/.exec(rangeHeader);
  if (!match) {
    return null;
  }
  return Number.parseInt(match[1], 10) + 1;
}

function createProgressReporter(
  total: number,
  onProgress?: (progress: StackMachineUploadProgress) => void,
) {
  let lastProgress = -1;
  return (loaded: number) => {
    const normalizedLoaded = Math.max(0, Math.min(total, loaded));
    const percent = total === 0 ? 1 : normalizedLoaded / total;
    if (percent < lastProgress || percent === lastProgress) {
      return;
    }
    lastProgress = percent;
    onProgress?.({
      loaded: normalizedLoaded,
      total,
      percent,
    });
  };
}

export const createZip = async (files: StackMachineZipFiles): Promise<Blob> => {
  const zipFileWriter = new BlobWriter();
  const zipWriter = new ZipWriter(zipFileWriter);
  for (const [key, value] of Object.entries(files)) {
    if (typeof value === "string") {
      await zipWriter.add(key, new TextReader(value));
    } else if (value instanceof Blob) {
      await zipWriter.add(key, new BlobReader(value));
    } else if (value instanceof Uint8Array) {
      await zipWriter.add(key, new Uint8ArrayReader(value));
    } else {
      await zipWriter.add(key, value);
    }
  }
  await zipWriter.close();
  const zipFileBlob = await zipFileWriter.getData();
  return zipFileBlob;
};

const initiateResumableUpload = async (
  url: string,
  options: StackMachineResolvedUploadOptions,
): Promise<string> => {
  const response = await retryUploadRequest(
    "initiateResumableUpload",
    options,
    async () => {
      const response = await uploadFetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "x-goog-resumable": "start",
            "Content-Length": "0",
          },
        },
        "initiateResumableUpload",
        options,
      );
      if (!response.ok) {
        throw uploadApiError(
          response,
          "initiateResumableUpload",
          "Failed to initiate upload",
        );
      }
      return response;
    },
  );

  const uploadUrl = response.headers.get("Location");
  if (!uploadUrl) {
    throw new StackMachineAPIError({
      message: "No upload URL received from server.",
      operationName: "initiateResumableUpload",
      statusCode: response.status,
    });
  }

  return uploadUrl;
};

const uploadChunk = async (
  uploadUrl: string,
  chunk: Blob,
  start: number,
  end: number,
  total: number,
  options: StackMachineResolvedUploadOptions,
) => {
  const response = await uploadFetch(
    uploadUrl,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Range": `bytes ${start}-${end - 1}/${total}`,
        "Content-Length": chunk.size.toString(),
      },
      body: chunk,
    },
    "uploadChunk",
    options,
  );

  if (!response.ok && response.status !== 308) {
    throw uploadApiError(response, "uploadChunk", "Upload failed");
  }

  return response;
};

const queryUploadedBytes = async (
  uploadUrl: string,
  total: number,
  options: StackMachineResolvedUploadOptions,
): Promise<number | null> => {
  const response = await uploadFetch(
    uploadUrl,
    {
      method: "PUT",
      headers: {
        "Content-Range": `bytes */${total}`,
        "Content-Length": "0",
      },
    },
    "queryUploadStatus",
    options,
  );

  if (response.status === 308) {
    return uploadedBytesFromRange(response.headers.get("Range")) ?? 0;
  }
  if (response.ok) {
    return total;
  }
  throw uploadApiError(
    response,
    "queryUploadStatus",
    "Failed to resume upload",
  );
};

const queryUploadedBytesSafely = async (
  uploadUrl: string,
  total: number,
  options: StackMachineResolvedUploadOptions,
): Promise<number | null> => {
  try {
    return await queryUploadedBytes(uploadUrl, total, options);
  } catch (error) {
    if (
      error instanceof StackMachineConnectionError &&
      error.code === "request_aborted"
    ) {
      throw error;
    }
    return null;
  }
};

const uploadChunkWithResumeRetry = async (
  uploadUrl: string,
  file: Blob,
  start: number,
  total: number,
  options: StackMachineResolvedUploadOptions,
  reportUploadedBytes: (uploadedBytes: number) => void,
) => {
  let attempt = 0;
  let currentStart = start;

  while (true) {
    const currentEnd = Math.min(currentStart + options.chunkSize, total);
    const chunk = file.slice(currentStart, currentEnd);
    try {
      const response = await uploadChunk(
        uploadUrl,
        chunk,
        currentStart,
        currentEnd,
        total,
        options,
      );
      return {
        response,
        start: currentStart,
        end: currentEnd,
      };
    } catch (error) {
      if (!shouldRetryUploadError(error, attempt, options.maxNetworkRetries)) {
        throw error;
      }
      const uploadedBytes = await queryUploadedBytesSafely(
        uploadUrl,
        total,
        options,
      );
      if (uploadedBytes !== null && uploadedBytes > currentStart) {
        currentStart = uploadedBytes;
        reportUploadedBytes(currentStart);
        if (currentStart >= total) {
          return {
            response: new Response(null, { status: 200 }),
            start,
            end: total,
          };
        }
      }
      await sleep(retryDelayMs(attempt));
      attempt += 1;
    }
  }
};

const uploadFileInChunks = async (
  uploadUrl: string,
  file: Blob,
  reportProgress: (loaded: number) => void,
  options: StackMachineResolvedUploadOptions,
) => {
  const totalSize = file.size;
  if (totalSize === 0) {
    reportProgress(0);
    return;
  }

  let start = 0;

  while (start < totalSize) {
    const result = await uploadChunkWithResumeRetry(
      uploadUrl,
      file,
      start,
      totalSize,
      options,
      reportProgress,
    );

    if (result.response.status === 308) {
      const uploadedBytes =
        uploadedBytesFromRange(result.response.headers.get("Range")) ??
        result.end;
      if (uploadedBytes <= start) {
        throw new StackMachineAPIError({
          message: "Upload did not report progress after chunk upload.",
          operationName: "uploadChunk",
          statusCode: result.response.status,
        });
      }
      start = uploadedBytes;
      reportProgress(start);
    } else if (result.response.ok) {
      start = totalSize;
      reportProgress(totalSize);
      break;
    }
  }
};

export const generateShortRandomName = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const handleUploadFileToCloud = async (
  environment: Environment,
  zipFile: Blob,
  options: StackMachineResolvedUploadOptions,
) => {
  validateUploadFile(zipFile);
  const reportProgress = createProgressReporter(
    zipFile.size,
    options.onProgress,
  );
  reportProgress(0);

  const networkCacheConfig: StackMachineCacheConfig = {
    force: options.force ?? true,
    stackMachine: options,
  };
  let query: uploadQuery["response"] | null | undefined;
  try {
    query = await fetchQuery<uploadQuery>(
      environment,
      graphql`
        query uploadQuery($filename: String!) {
          getSignedUrl(filename: $filename) {
            url
          }
        }
      `,
      {
        filename: `${generateShortRandomName()}.zip`,
      },
      {
        networkCacheConfig,
      },
    ).toPromise();
  } catch (error) {
    throw stackMachineErrorFromUnknown(error, "uploadQuery");
  }

  if (query?.getSignedUrl?.url) {
    const url = query?.getSignedUrl?.url;
    const uploadUrl = await initiateResumableUpload(url, options);
    await uploadFileInChunks(uploadUrl, zipFile, reportProgress, options);
    return url;
  } else {
    throw new StackMachineAPIError({
      message: "Failed to generate upload URL for the zip file.",
      operationName: "uploadQuery",
    });
  }
};
