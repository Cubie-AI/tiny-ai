/**
 * TinyError is the base class for all errors in the Tiny library.
 */
export class TinyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TinyError";
  }
}

/**
 * TinyProviderError is used for errors related to providers.
 */
export class TinyProviderError extends TinyError {
  constructor(message: string) {
    super(message);
    this.name = "TinyProviderError";
  }
}

/**
 * TinyToolError is used for errors related to tools.
 */
export class TinyToolError extends TinyError {
  constructor(message: string) {
    super(message);
    this.name = "TinyToolError";
  }
}

/**
 * TinyAgentError is used for errors related to agents.
 */
export class TinyAgentError extends TinyError {
  constructor(message: string) {
    super(message);
    this.name = "TinyAgentError";
  }
}

export function getErrorMessage(error: unknown): string {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Unknown error occurred";
  }
  return message;
}
