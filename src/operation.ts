import { ConfigFile, } from './configuration-files';
import Utils, { ConfigurationError, OperationTimeoutError, } from './utils';

const FIVE_MINS_IN_MS = 300000;

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
  getConfigurationFile: (id: string) => ConfigFile
}

 type BeforeHandlerProps = {
  parsed: ParseObject
}

 type HandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
}

 type AfterHandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
  handler_result: unknown
}

 type SuccessHandlerProps = {
  parsed: ParseObject
  before_handler_result: unknown
  handler_result: unknown
  after_handler_result: unknown
}

 type FailureHandlerProps = {
  parsed: ParseObject
}

 type OperationResults = {
  before_handler_result: unknown
  handler_result: unknown
  after_handler_result: unknown
  handler_success_result: unknown
  handler_failure_result: unknown
  handler_timeout_result: unknown
}

export type BeforeHandler = ((props: BeforeHandlerProps) => Promise<unknown> | unknown) | undefined
export type Handler = ((props: HandlerProps) => Promise<unknown> | unknown) | undefined
export type AfterHandler = ((props: AfterHandlerProps) => Promise<unknown> | unknown) | undefined
export type SuccessHandler = ((props: SuccessHandlerProps) => Promise<unknown> | unknown) | undefined
export type FailureHandler = ((props: FailureHandlerProps) => Promise<unknown> | unknown) | undefined
 type OperationHandler = ((props: ParseObject) => Promise<OperationResults> | never) | undefined

export interface I_Operation {
  timeout?: number
  handler?: Handler
  beforeHandler?: BeforeHandler
  afterHandler?: AfterHandler
  onHandlerSuccess?: SuccessHandler
  onHandlerFailure?: FailureHandler
  onHandlerTimeout?: Handler
}

export default class Operation implements I_Operation {
  #command_name: string;
  timeout!: number;
  handler!: Handler;
  beforeHandler!: BeforeHandler;
  afterHandler!: AfterHandler;
  onHandlerSuccess!: SuccessHandler;
  onHandlerFailure!: FailureHandler;
  onHandlerTimeout!: Handler;
  operation!: OperationHandler;

  constructor (command_name: string, operation: I_Operation = {}) {
    this.#command_name = command_name;
    this
      .#setTimeout(operation.timeout)
      .#setOnHandlerTimeout(operation.onHandlerTimeout)
      .#setHandler(operation.handler)
      .#setBeforeHandler(operation.beforeHandler)
      .#setAfterHandler(operation.afterHandler)
      .#setOnHandlerSuccess(operation.onHandlerSuccess)
      .#setOnHandlerFailure(operation.onHandlerFailure)
      .#setOperation();
  }

  #setTimeout = (timeout: number = FIVE_MINS_IN_MS): Operation | never => {
    if (Utils.isDefined(timeout) && (Utils.isNotNumber(timeout) || timeout < 0)) {
      throw new ConfigurationError(`Operation property "timeout" must be of type "number" and cannot be less than 0ms.`);
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

  #setBeforeHandler = (beforeHandler?: BeforeHandler): Operation | never => {
    if (Utils.isDefined(beforeHandler) && (Utils.isNotFunction(beforeHandler) || Utils.isNotDefined(this.handler))) {
      throw new ConfigurationError(`Operation property "beforeHandler" must be of type "function" and can only be defined if "handler" is defined for command "${this.#command_name}".`);
    }

    this.beforeHandler = beforeHandler;

    return this;
  };

  #setAfterHandler = (afterHandler?: AfterHandler): Operation | never => {
    if (Utils.isDefined(afterHandler) && (Utils.isNotFunction(afterHandler) || Utils.isNotDefined(this.handler))) {
      throw new ConfigurationError(`Operation property "afterHandler" must be of type "function" and can only be defined if "handler" is defined for command "${this.#command_name}".`);
    }

    this.afterHandler = afterHandler;

    return this;
  };

  #setOnHandlerSuccess = (onHandlerSuccess?: SuccessHandler): Operation | never => {
    if (Utils.isDefined(onHandlerSuccess) && (Utils.isNotFunction(onHandlerSuccess) || Utils.isNotDefined(this.handler))) {
      throw new ConfigurationError(`Operation property "onHandlerSuccess" must be of type "function" and can only be defined if "handler" is defined for command "${this.#command_name}".`);
    }

    this.onHandlerSuccess = onHandlerSuccess;

    return this;
  };

  #setOnHandlerFailure = (onHandlerFailure?: FailureHandler): Operation | never => {
    if (Utils.isDefined(onHandlerFailure) && (Utils.isNotFunction(onHandlerFailure) || Utils.isNotDefined(this.handler))) {
      throw new ConfigurationError(`Operation property "onHandlerFailure" must be of type "function" and can only be defined if "handler" is defined for command "${this.#command_name}".`);
    }

    this.onHandlerFailure = onHandlerFailure;

    return this;
  };

  #setOperation = (): Operation => {
    let operation: OperationHandler;

    if (this.handler) {
      const timeoutError = new OperationTimeoutError(`Command handler for command "${this.#command_name}" has timed out after ${this.timeout}ms.`);

      operation = async (props: ParseObject): Promise<OperationResults> | never => {
        let before_handler_result: unknown;
        let handler_result: unknown;
        let after_handler_result: unknown;
        let handler_success_result: unknown;
        let handler_failure_result: unknown;
        let handler_timeout_result: unknown;

        const handleWithTimeout = async (): Promise<void> | never => {
          let timer: NodeJS.Timeout;

          try {
            handler_result = await Promise.race([
              this.handler!({ parsed: props, before_handler_result, }),
              new Promise((_, reject) => timer = setTimeout(reject, this.timeout, timeoutError)),
            ]);
          } catch (error) {
            if (error instanceof OperationTimeoutError) {
              handler_timeout_result = await this.onHandlerTimeout?.({ parsed: props, before_handler_result, });
            }
            throw error;
          } finally {
            clearTimeout(timer!);
          }
        };

        try {
          before_handler_result = await this.beforeHandler?.({ parsed: props, });
          await handleWithTimeout();
          after_handler_result = await this.afterHandler?.({ parsed: props, before_handler_result, handler_result, });
          handler_success_result = await this.onHandlerSuccess?.({ parsed: props, before_handler_result, handler_result, after_handler_result, });
        } catch (error) {
          if (!(error instanceof OperationTimeoutError)) {
            handler_failure_result = await this.onHandlerFailure?.({ parsed: props, });
          }
          throw error;
        }

        return {
          before_handler_result,
          handler_result,
          after_handler_result,
          handler_success_result,
          handler_failure_result,
          handler_timeout_result,
        };
      };
    }

    this.operation = operation;

    return this;
  };
}
