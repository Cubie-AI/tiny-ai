export class TinyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TinyError";
  }
}

export class TinyProviderError extends TinyError {
  constructor(message: string) {
    super(message);
    this.name = "TinyProviderError";
  }
}

export class TinyToolError extends TinyError {
  constructor(message: string) {
    super(message);
    this.name = "TinyToolError";
  }
}

export class TinyAgentError extends TinyError {
  constructor(message: string) {
    super(message);
    this.name = "TinyAgentError";
  }
}
