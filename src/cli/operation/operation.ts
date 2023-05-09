import { I_Operation, } from '../interfaces';
import { AfterHandler, BeforeHandler, FailureHandler, Handler, OperationHandler, SuccessHandler, OperationResult, } from '../types';
import { ConfigurationError, OperationTimeoutError, } from '../errors';
import Utils from '../../utils';

const FIVE_MINS_IN_MS = 300000;

export class Operation implements I_Operation {
  command_name: string;
  command_help: string;
  is_default_handler: boolean;

  timeout!: number;
  handler!: Handler;
  beforeHandler!: BeforeHandler;
  afterHandler!: AfterHandler;
  onHandlerSuccess!: SuccessHandler;
  onHandlerFailure!: FailureHandler;
  onHandlerTimeout!: Handler | undefined;
  operation!: OperationHandler;

  constructor (command_name: string, command_help: string, operation: I_Operation = {}) {
    this.command_name = command_name;
    this.command_help = command_help;
    this.is_default_handler = Utils.isNotDefined(operation.handler);

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
    this.timeout = timeout;

    return this;
  };

  #setOnHandlerTimeout = (onHandlerTimeout?: Handler): Operation | never => {
    this.onHandlerTimeout = onHandlerTimeout;

    return this;
  };

  #setHandler = (handler?: Handler): Operation | never => {
    this.handler = handler || ((): void => console.info(this.command_help));

    return this;
  };

  #setBeforeHandler = (beforeHandler?: BeforeHandler): Operation | never => {
    this.beforeHandler = beforeHandler;

    return this;
  };

  #setAfterHandler = (afterHandler?: AfterHandler): Operation | never => {
    this.afterHandler = afterHandler;

    return this;
  };

  #setOnHandlerSuccess = (onHandlerSuccess?: SuccessHandler): Operation | never => {
    this.onHandlerSuccess = onHandlerSuccess;

    return this;
  };

  #setOnHandlerFailure = (onHandlerFailure?: FailureHandler): Operation | never => {
    this.onHandlerFailure = onHandlerFailure;

    return this;
  };

  #setOperation = (): Operation => {
    const timeoutError = new OperationTimeoutError(`Command handler for command "${this.command_name}" has timed out after ${this.timeout}ms.`);

    const operation: OperationHandler = async ({ parsed, getConfigurationFile, }): Promise<OperationResult> | never => {
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
            this.handler({ parsed, before_handler_result, getConfigurationFile, }),
            new Promise((_, reject) => timer = setTimeout(reject, this.timeout, timeoutError)),
          ]);
        } catch (error) {
          if (error instanceof OperationTimeoutError) {
            handler_timeout_result = await this.onHandlerTimeout?.({ parsed, before_handler_result, getConfigurationFile, });
          }
          throw error;
        } finally {
          clearTimeout(timer!);
        }
      };

      try {
        before_handler_result = await this.beforeHandler?.({ parsed, getConfigurationFile, });
        await handleWithTimeout();
        after_handler_result = await this.afterHandler?.({ parsed, before_handler_result, handler_result, getConfigurationFile, });
        handler_success_result = await this.onHandlerSuccess?.({ parsed, before_handler_result, handler_result, after_handler_result, getConfigurationFile, });
      } catch (e) {
        const error = e as Error;
        if (!(error instanceof OperationTimeoutError)) {
          handler_failure_result = await this.onHandlerFailure?.({ parsed, getConfigurationFile, error, });
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

    this.operation = operation;

    return this;
  };
}

export class StrictOperation extends Operation {
  constructor (command_name: string, command_help: string, operation: I_Operation = {}) {
    super(command_name, command_help, operation);
    this
      .#setTimeout(operation.timeout)
      .#setHandler(operation.handler)
      .#setOnHandlerTimeout(operation.onHandlerTimeout)
      .#setBeforeHandler(operation.beforeHandler)
      .#setAfterHandler(operation.afterHandler)
      .#setOnHandlerSuccess(operation.onHandlerSuccess)
      .#setOnHandlerFailure(operation.onHandlerFailure);
  }

  #setTimeout = (timeout: number = FIVE_MINS_IN_MS): StrictOperation | never => {
    if (Utils.isDefined(timeout) && (Utils.isNotNumber(timeout) || timeout < 0)) {
      throw new ConfigurationError(`Operation property "timeout" must be of type "number" and cannot be less than 0ms for command "${this.command_name}".`);
    }

    return this;
  };

  #setHandler = (handler?: Handler): StrictOperation | never => {
    if (Utils.isDefined(handler) && Utils.isNotFunction(handler)) {
      throw new ConfigurationError(`Operation property "handler" must be of type "function" for command "${this.command_name}".`);
    }

    return this;
  };

  #setOnHandlerTimeout = (onHandlerTimeout?: Handler): StrictOperation | never => {
    if (Utils.isDefined(onHandlerTimeout) && (Utils.isNotFunction(onHandlerTimeout) || this.is_default_handler)) {
      throw new ConfigurationError(`Operation property "onHandlerTimeout" must be of type "function" and can only be defined if "handler" is defined for command "${this.command_name}".`);
    }

    return this;
  };

  #setBeforeHandler = (beforeHandler?: BeforeHandler): StrictOperation | never => {
    if (Utils.isDefined(beforeHandler) && (Utils.isNotFunction(beforeHandler) || this.is_default_handler)) {
      throw new ConfigurationError(`Operation property "beforeHandler" must be of type "function" and can only be defined if "handler" is defined for command "${this.command_name}".`);
    }

    return this;
  };

  #setAfterHandler = (afterHandler?: AfterHandler): StrictOperation | never => {
    if (Utils.isDefined(afterHandler) && (Utils.isNotFunction(afterHandler) || this.is_default_handler)) {
      throw new ConfigurationError(`Operation property "afterHandler" must be of type "function" and can only be defined if "handler" is defined for command "${this.command_name}".`);
    }

    return this;
  };

  #setOnHandlerSuccess = (onHandlerSuccess?: SuccessHandler): StrictOperation | never => {
    if (Utils.isDefined(onHandlerSuccess) && (Utils.isNotFunction(onHandlerSuccess) || this.is_default_handler)) {
      throw new ConfigurationError(`Operation property "onHandlerSuccess" must be of type "function" and can only be defined if "handler" is defined for command "${this.command_name}".`);
    }

    return this;
  };

  #setOnHandlerFailure = (onHandlerFailure?: FailureHandler): StrictOperation | never => {
    if (Utils.isDefined(onHandlerFailure) && (Utils.isNotFunction(onHandlerFailure) || this.is_default_handler)) {
      throw new ConfigurationError(`Operation property "onHandlerFailure" must be of type "function" and can only be defined if "handler" is defined for command "${this.command_name}".`);
    }

    return this;
  };
}
