import RelayRuntime, { type Environment } from "relay-runtime";
const { graphql, fetchQuery } = RelayRuntime;
import type {
  StackMachineCacheConfig,
  StackMachineRequestOptions,
} from "./environment";
import {
  StackMachineAPIError,
  StackMachineConnectionError,
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

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function uploadConnectionError(
  error: unknown,
  operationName: string,
): StackMachineConnectionError {
  return new StackMachineConnectionError({
    message: isAbortError(error)
      ? "StackMachine upload was aborted."
      : error instanceof Error
        ? error.message
        : "StackMachine upload failed.",
    operationName,
    code: isAbortError(error) ? "request_aborted" : undefined,
    cause: error,
  });
}

export const createZip = async (files: {
  [key: string]: Blob | string | Uint8Array | ReadableStream | File;
}): Promise<Blob> => {
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
  setUploadFilesProgress?: (progress: number) => void,
  options?: StackMachineRequestOptions,
): Promise<string> => {
  let response: Response;
  try {
    response = await globalThis.fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "x-goog-resumable": "start",
        "Content-Length": "0",
      },
      signal: options?.signal,
    });
  } catch (error) {
    throw uploadConnectionError(error, "initiateResumableUpload");
  }
  setUploadFilesProgress?.(0.01);

  if (!response.ok) {
    throw new StackMachineAPIError({
      message: `Failed to initiate upload: ${response.statusText}`,
      operationName: "initiateResumableUpload",
      statusCode: response.status,
    });
  }

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
  options?: StackMachineRequestOptions,
) => {
  let response: Response;
  try {
    response = await globalThis.fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Range": `bytes ${start}-${end - 1}/${total}`,
        "Content-Length": chunk.size.toString(),
      },
      body: chunk,
      signal: options?.signal,
    });
  } catch (error) {
    throw uploadConnectionError(error, "uploadChunk");
  }

  if (!response.ok && response.status !== 308) {
    throw new StackMachineAPIError({
      message: `Upload failed: ${response.statusText}`,
      operationName: "uploadChunk",
      statusCode: response.status,
    });
  }

  return response;
};

const uploadFileInChunks = async (
  uploadUrl: string,
  file: Blob,
  setUploadFilesProgress?: (progress: number) => void,
  options?: StackMachineRequestOptions,
) => {
  const totalSize = file.size;

  let start = 0;
  let end = Math.min(CHUNK_SIZE, totalSize);

  while (start < totalSize) {
    const chunk = file.slice(start, end);
    const response = await uploadChunk(
      uploadUrl,
      chunk,
      start,
      end,
      totalSize,
      options,
    );
    if (response.status === 308) {
      const rangeHeader = response.headers.get("Range");
      if (rangeHeader) {
        const uploadedBytes = parseInt(rangeHeader.split("-")[1]) + 1;
        setUploadFilesProgress?.(uploadedBytes / totalSize);
        start = uploadedBytes;
        end = Math.min(start + CHUNK_SIZE, totalSize);
      }
    } else if (response.ok) {
      setUploadFilesProgress?.(1);
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
  setUploadFilesProgress?: (progress: number) => void,
  options?: StackMachineRequestOptions,
) => {
  const networkCacheConfig: StackMachineCacheConfig = {
    force: options?.force ?? true,
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
    // console.log("FileUploaded", url);
    const uploadUrl = await initiateResumableUpload(
      url,
      setUploadFilesProgress,
      options,
    );
    await uploadFileInChunks(
      uploadUrl,
      zipFile,
      setUploadFilesProgress,
      options,
    );
    return url;
  } else {
    throw new StackMachineAPIError({
      message: "Failed to generate upload URL for the zip file.",
      operationName: "uploadQuery",
    });
  }
};
