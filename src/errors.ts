export class ConfigurationError extends Error {
  constructor (message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class OperationError extends Error {
  constructor (message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'OperationError';
  }
}

export class OperationTimeoutError extends Error {
  constructor (message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'OperationTimeoutError';
  }
}

export class ParseError extends Error {
  help: string;

  constructor (message: string, help?: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'ParseError';
    this.help = help ? `\n\n${help}` : '';
  }
}
