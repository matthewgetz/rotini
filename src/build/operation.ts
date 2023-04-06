import Utils, { ConfigurationError, } from '../utils';

const FIVE_MINS_IN_MS = 300000;
const THIRTY_MINS_IN_MS = 1800000;

export type ParseObject = {
  commands: Array<{
    name: string,
    arguments: {
      [key: string]: string | number | boolean | (string | number | boolean)[]
    },
    flags: {
      [key: string]: string | number | boolean | (string | number | boolean)[]
    }
  }>
  global_flags: {
    [key: string]: string | number | boolean | (string | number | boolean)[]
  }
  getConfigurationFile: (id: string) => File
}

export type Handler = ((props: ParseObject) => Promise<unknown> | unknown) | undefined

export interface I_Operation {
  timeout?: number
  handler?: Handler
  beforeHandler?: Handler
  afterHandler?: Handler
  onHandlerSuccess?: Handler
  onHandlerFailure?: Handler
  onHandlerTimeout?: Handler;
}

export default class Operation implements I_Operation {
  #command_name: string;

  timeout!: number;
  handler!: Handler;
  beforeHandler!: Handler;
  afterHandler!: Handler;
  onHandlerSuccess!: Handler;
  onHandlerFailure!: Handler;
  onHandlerTimeout!: Handler;

  constructor (command_name: string, operation: I_Operation = {}) {
    this.#command_name = command_name;
    this
      .#setTimeout(operation.timeout)
      .#setOnHandlerTimeout(operation.onHandlerTimeout)
      .#setHandler(operation.handler)
      .#setBeforeHandler(operation.beforeHandler)
      .#setAfterHandler(operation.afterHandler)
      .#setOnHandlerSuccess(operation.onHandlerSuccess)
      .#setOnHandlerFailure(operation.onHandlerFailure);
  }

  #setTimeout = (timeout: number = FIVE_MINS_IN_MS): Operation | never => {
    if (Utils.isDefined(timeout) && (Utils.isNotNumber(timeout) || timeout < 0 || timeout > THIRTY_MINS_IN_MS)) {
      throw new ConfigurationError(`Operation property "timeout" must be of type "number" and cannot be less than 0ms or greater than ${THIRTY_MINS_IN_MS}ms.`);
    }

    this.timeout = timeout;

    return this;
  };

  #setOnHandlerTimeout = (onHandlerTimeout?: Handler): Operation | never => {
    if (Utils.isDefined(onHandlerTimeout) && Utils.isNotFunction(onHandlerTimeout)) {
      throw new ConfigurationError(`Operation property "onHandlerTimeout" must be of type "function" for command "${this.#command_name}".`);
    }

    this.onHandlerTimeout = onHandlerTimeout;

    return this;
  };

  #setHandler = (handler?: Handler): Operation | never => {
    if (Utils.isDefined(handler) && Utils.isNotFunction(handler)) {
      throw new ConfigurationError(`Operation property "handler" must be of type "function" for command "${this.#command_name}".`);
    }

    this.handler = handler;

    return this;
  };

  #setBeforeHandler = (beforeHandler?: Handler): Operation | never => {
    if (Utils.isDefined(beforeHandler) && (Utils.isNotFunction(beforeHandler) || Utils.isNotDefined(this.handler))) {
      throw new ConfigurationError(`Operation property "beforeHandler" must be of type "function" and can only be defined if "handler" is defined for command "${this.#command_name}".`);
    }

    this.beforeHandler = beforeHandler;

    return this;
  };

  #setAfterHandler = (afterHandler?: Handler): Operation | never => {
    if (Utils.isDefined(afterHandler) && (Utils.isNotFunction(afterHandler) || Utils.isNotDefined(this.handler))) {
      throw new ConfigurationError(`Operation property "afterHandler" must be of type "function" and can only be defined if "handler" is defined for command "${this.#command_name}".`);
    }

    this.afterHandler = afterHandler;

    return this;
  };

  #setOnHandlerSuccess = (onHandlerSuccess?: Handler): Operation | never => {
    if (Utils.isDefined(onHandlerSuccess) && (Utils.isNotFunction(onHandlerSuccess) || Utils.isNotDefined(this.handler))) {
      throw new ConfigurationError(`Operation property "onHandlerSuccess" must be of type "function" and can only be defined if "handler" is defined for command "${this.#command_name}".`);
    }

    this.onHandlerSuccess = onHandlerSuccess;

    return this;
  };

  #setOnHandlerFailure = (onHandlerFailure?: Handler): Operation | never => {
    if (Utils.isDefined(onHandlerFailure) && (Utils.isNotFunction(onHandlerFailure) || Utils.isNotDefined(this.handler))) {
      throw new ConfigurationError(`Operation property "onHandlerFailure" must be of type "function" and can only be defined if "handler" is defined for command "${this.#command_name}".`);
    }

    this.onHandlerFailure = onHandlerFailure;

    return this;
  };
}
