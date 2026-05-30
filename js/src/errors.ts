export type StackMachineGraphQLErrorPayload = {
  message?: string;
  extensions?: Record<string, unknown>;
  locations?: readonly unknown[];
  path?: readonly (string | number)[];
  [key: string]: unknown;
};

export type StackMachineErrorOptions = {
  message: string;
  operationName?: string;
  statusCode?: number;
  requestId?: string | null;
  code?: string;
  param?: string;
  graphQLErrors?: readonly StackMachineGraphQLErrorPayload[];
  cause?: unknown;
};

export class StackMachineError extends Error {
  readonly type: string;
  readonly operationName?: string;
  readonly statusCode?: number;
  readonly requestId?: string | null;
  readonly code?: string;
  readonly param?: string;
  readonly graphQLErrors?: readonly StackMachineGraphQLErrorPayload[];
  override readonly cause?: unknown;

  constructor(options: StackMachineErrorOptions) {
    super(options.message);
    this.name = new.target.name;
    this.type = new.target.name;
    this.operationName = options.operationName;
    this.statusCode = options.statusCode;
    this.requestId = options.requestId;
    this.code = options.code;
    this.param = options.param;
    this.graphQLErrors = options.graphQLErrors;
    this.cause = options.cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class StackMachineConnectionError extends StackMachineError {}

export class StackMachineAPIError extends StackMachineError {}

export class StackMachineGraphQLError extends StackMachineError {}

export class StackMachineAuthenticationError extends StackMachineAPIError {}

export class StackMachinePermissionError extends StackMachineAPIError {}

export class StackMachineRateLimitError extends StackMachineAPIError {}

export class StackMachineInvalidRequestError extends StackMachineAPIError {}

export class StackMachineValidationError extends StackMachineError {}

export function isStackMachineError(
  error: unknown,
): error is StackMachineError {
  return error instanceof StackMachineError;
}

export function stackMachineErrorFromGraphQLErrors(
  graphQLErrors: readonly StackMachineGraphQLErrorPayload[],
  operationName?: string,
): StackMachineGraphQLError {
  const firstError = graphQLErrors[0];
  return new StackMachineGraphQLError({
    message: firstError?.message || "StackMachine GraphQL request failed.",
    operationName,
    graphQLErrors,
    code:
      typeof firstError?.extensions?.code === "string"
        ? firstError.extensions.code
        : undefined,
    param:
      typeof firstError?.extensions?.param === "string"
        ? firstError.extensions.param
        : undefined,
  });
}

function graphQLErrorsFromUnknown(
  error: unknown,
): readonly StackMachineGraphQLErrorPayload[] | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const source = (error as any).source;
  const errors = source?.errors ?? (error as any).errors;
  return Array.isArray(errors) ? errors : undefined;
}

function operationNameFromUnknown(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  return (error as any).source?.operation?.params?.name;
}

export function stackMachineErrorFromUnknown(
  error: unknown,
  operationName?: string,
): StackMachineError {
  if (isStackMachineError(error)) {
    return error;
  }

  const graphQLErrors = graphQLErrorsFromUnknown(error);
  if (graphQLErrors?.length) {
    return stackMachineErrorFromGraphQLErrors(
      graphQLErrors,
      operationName ?? operationNameFromUnknown(error),
    );
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "StackMachine request failed.";

  return new StackMachineConnectionError({
    message,
    operationName,
    cause: error,
  });
}
