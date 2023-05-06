import { StrictOperation, } from './operation';
import { ConfigurationFiles, } from '../configuration-files';
import { OperationError, OperationTimeoutError, } from '../errors';

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

vi.mock('console', () => {
  return {
    info: vi.fn(),
  };
});

const configuration_files = new ConfigurationFiles([
  {
    id: 'rotini',
    directory: './configs',
    file: 'config.json',
  },
]);

const getConfigurationFile = configuration_files.getConfigurationFile;

describe('StrictOperation', () => {
  it('returns default operation', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});

    const operation = new StrictOperation('get', 'get command help');

    expect(operation.timeout).toBe(300000);
    expect(operation.beforeHandler).toBe(undefined);
    expect(operation.handler).not.toBe(undefined);
    expect(operation.afterHandler).toBe(undefined);
    expect(operation.onHandlerSuccess).toBe(undefined);
    expect(operation.onHandlerFailure).toBe(undefined);
    expect(operation.onHandlerTimeout).toBe(undefined);
    expect(operation.operation).not.toBe(undefined);

    operation.handler({
      before_handler_result: undefined,
      parsed: { commands: [ { name: 'get', arguments: {}, flags: {}, }, ], global_flags: {}, },
      getConfigurationFile,
    });
    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenLastCalledWith('get command help');

    await operation.operation({
      parsed: { commands: [ { name: 'get', arguments: {}, flags: {}, }, ], global_flags: {}, },
      getConfigurationFile,
    });
    expect(info).toHaveBeenCalledTimes(2);
    expect(info).toHaveBeenLastCalledWith('get command help');
  });

  it('returns operation (undefined handlers)', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});

    const operation = new StrictOperation(
      'get',
      'get command help',
      {
        handler: (): void => console.info('defined handler'),
      }
    );

    expect(operation.timeout).toBe(300000);
    expect(operation.beforeHandler).toBe(undefined);
    expect(operation.handler).not.toBe(undefined);
    expect(operation.afterHandler).toBe(undefined);
    expect(operation.onHandlerSuccess).toBe(undefined);
    expect(operation.onHandlerFailure).toBe(undefined);
    expect(operation.onHandlerTimeout).toBe(undefined);
    expect(operation.operation).not.toBe(undefined);

    operation.handler({
      before_handler_result: undefined,
      parsed: { commands: [ { name: 'get', arguments: {}, flags: {}, }, ], global_flags: {}, },
      getConfigurationFile,
    });
    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenLastCalledWith('defined handler');

    await operation.operation({
      parsed: { commands: [ { name: 'get', arguments: {}, flags: {}, }, ], global_flags: {}, },
      getConfigurationFile,
    });
    expect(info).toHaveBeenCalledTimes(2);
    expect(info).toHaveBeenLastCalledWith('defined handler');
  });

  it('returns operation (defined handlers)', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});

    const operation = new StrictOperation(
      'get',
      'get command help',
      {
        beforeHandler: (): void => console.info('before handler called'),
        handler: (): void => console.info('defined handler'),
        afterHandler: (): void => console.info('after handler called'),
        onHandlerSuccess: (): void => console.info('on success handler called'),
      }
    );

    expect(operation.timeout).toBe(300000);
    expect(operation.beforeHandler).not.toBe(undefined);
    expect(operation.handler).not.toBe(undefined);
    expect(operation.afterHandler).not.toBe(undefined);
    expect(operation.onHandlerSuccess).not.toBe(undefined);
    expect(operation.onHandlerFailure).toBe(undefined);
    expect(operation.onHandlerTimeout).toBe(undefined);
    expect(operation.operation).not.toBe(undefined);

    operation.handler({
      before_handler_result: undefined,
      parsed: { commands: [ { name: 'get', arguments: {}, flags: {}, }, ], global_flags: {}, },
      getConfigurationFile,
    });
    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenLastCalledWith('defined handler');

    await operation.operation({
      parsed: { commands: [ { name: 'get', arguments: {}, flags: {}, }, ], global_flags: {}, },
      getConfigurationFile,
    });
    expect(info).toHaveBeenCalledTimes(5);
    expect(info).toHaveBeenCalledWith('before handler called');
    expect(info).toHaveBeenCalledWith('defined handler');
    expect(info).toHaveBeenCalledWith('after handler called');
    expect(info).toHaveBeenLastCalledWith('on success handler called');
  });

  it('onHandlerFailure called when handler error is not OperationTimeoutError', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});

    const expectedError = new OperationError('operation error');

    const operation = new StrictOperation(
      'get',
      'get command help',
      {
        handler: (): void => { throw new OperationError('operation error'); },
        onHandlerFailure: (): void => console.info('on failure handler called'),
      }
    );

    expect(operation.timeout).toBe(300000);
    expect(operation.beforeHandler).toBe(undefined);
    expect(operation.handler).not.toBe(undefined);
    expect(operation.afterHandler).toBe(undefined);
    expect(operation.onHandlerSuccess).toBe(undefined);
    expect(operation.onHandlerFailure).not.toBe(undefined);
    expect(operation.onHandlerTimeout).toBe(undefined);
    expect(operation.operation).not.toBe(undefined);

    let result;
    try {
      await operation.operation({
        parsed: { commands: [ { name: 'get', arguments: {}, flags: {}, }, ], global_flags: {}, },
        getConfigurationFile,
      });
    } catch (e) {
      result = e;
    }

    expect(result).toEqual(expectedError);
    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('on failure handler called');
  });

  it('calls onHandlerTimeout function when async timeout is hit (undefined onHandlerFailure)', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const expectedError = new OperationTimeoutError('Command handler for command "get" has timed out after 100ms.');

    const operation = new StrictOperation(
      'get',
      'get command help',
      {
        timeout: 100,
        handler: (): Promise<void> => sleep(200),
        onHandlerTimeout: (): void => console.info('timeout handler called'),
      }
    );

    expect(operation.timeout).toBe(100);
    expect(operation.beforeHandler).toBe(undefined);
    expect(operation.handler).not.toBe(undefined);
    expect(operation.afterHandler).toBe(undefined);
    expect(operation.onHandlerSuccess).toBe(undefined);
    expect(operation.onHandlerFailure).toBe(undefined);
    expect(operation.onHandlerTimeout).not.toBe(undefined);
    expect(operation.operation).not.toBe(undefined);

    let result;
    try {
      await operation.operation({
        parsed: { commands: [ { name: 'get', arguments: {}, flags: {}, }, ], global_flags: {}, },
        getConfigurationFile,
      });
    } catch (e) {
      result = e;
    }

    expect(result).toEqual(expectedError);
    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenLastCalledWith('timeout handler called');
  });

  it('calls onHandlerTimeout function when async timeout is hit (defined onHandlerFailure)', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const expectedError = new OperationTimeoutError('Command handler for command "get" has timed out after 100ms.');

    const operation = new StrictOperation(
      'get',
      'get command help',
      {
        timeout: 100,
        handler: (): Promise<void> => sleep(200),
        onHandlerTimeout: (): void => console.info('timeout handler called'),
        onHandlerFailure: (): void => console.info('failure handler called'),
      }
    );

    expect(operation.timeout).toBe(100);
    expect(operation.beforeHandler).toBe(undefined);
    expect(operation.handler).not.toBe(undefined);
    expect(operation.afterHandler).toBe(undefined);
    expect(operation.onHandlerSuccess).toBe(undefined);
    expect(operation.onHandlerFailure).not.toBe(undefined);
    expect(operation.onHandlerTimeout).not.toBe(undefined);
    expect(operation.operation).not.toBe(undefined);

    let result;
    try {
      await operation.operation({
        parsed: { commands: [ { name: 'get', arguments: {}, flags: {}, }, ], global_flags: {}, },
        getConfigurationFile,
      });
    } catch (e) {
      result = e;
    }

    expect(result).toEqual(expectedError);
    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('timeout handler called');
    expect(info).not.toHaveBeenLastCalledWith('failure handler called');
  });

  it('throws error when operation property "timeout" is not number', () => {
    expect(() => {
      new StrictOperation(
        'get',
        'get command help',
        {
          // @ts-expect-error timeout is not number
          timeout: 'not a number',
        }
      );
    }).toThrowError('Operation property "timeout" must be of type "number" and cannot be less than 0ms for command "get".');
  });

  it('throws error when operation property "timeout" is less than 0', () => {
    expect(() => {
      new StrictOperation(
        'get',
        'get command help',
        {
          timeout: -3,
        }
      );
    }).toThrowError('Operation property "timeout" must be of type "number" and cannot be less than 0ms for command "get".');
  });

  it('throws error when operation property "handler" is not function', () => {
    expect(() => {
      new StrictOperation(
        'get',
        'get command help',
        {
          // @ts-expect-error handler is not function
          handler: 'should be function',
        }
      );
    }).toThrowError('Operation property "handler" must be of type "function" for command "get".');
  });

  it('throws error when operation property "onHandlerTimeout" is not function', () => {
    expect(() => {
      new StrictOperation(
        'get',
        'get command help',
        {
          // @ts-expect-error onHandlerTimeout is not function
          onHandlerTimeout: 'should be function',
        }
      );
    }).toThrowError('Operation property "onHandlerTimeout" must be of type "function" and can only be defined if "handler" is defined for command "get".');
  });

  it('throws error when operation property "beforeHandler" is not function', () => {
    expect(() => {
      new StrictOperation(
        'get',
        'get command help',
        {
          // @ts-expect-error handler is not function
          beforeHandler: 'should be function',
        }
      );
    }).toThrowError('Operation property "beforeHandler" must be of type "function" and can only be defined if "handler" is defined for command "get".');
  });

  it('throws error when operation property "afterHandler" is not function', () => {
    expect(() => {
      new StrictOperation(
        'get',
        'get command help',
        {
          // @ts-expect-error handler is not function
          afterHandler: 'should be function',
        }
      );
    }).toThrowError('Operation property "afterHandler" must be of type "function" and can only be defined if "handler" is defined for command "get".');
  });

  it('throws error when operation property "onHandlerSuccess" is not function', () => {
    expect(() => {
      new StrictOperation(
        'get',
        'get command help',
        {
          // @ts-expect-error handler is not function
          onHandlerSuccess: 'should be function',
        }
      );
    }).toThrowError('Operation property "onHandlerSuccess" must be of type "function" and can only be defined if "handler" is defined for command "get".');
  });

  it('throws error when operation property "onHandlerSuccess" is defined function but "handler" is default handler', () => {
    expect(() => {
      new StrictOperation(
        'get',
        'get command help',
        {
          onHandlerSuccess: (): void => {},
        }
      );
    }).toThrowError('Operation property "onHandlerSuccess" must be of type "function" and can only be defined if "handler" is defined for command "get".');
  });

  it('throws error when operation property "onHandlerFailure" is not function', () => {
    expect(() => {
      new StrictOperation(
        'get',
        'get command help',
        {
          // @ts-expect-error handler is not function
          onHandlerFailure: 'should be function',
        }
      );
    }).toThrowError('Operation property "onHandlerFailure" must be of type "function" and can only be defined if "handler" is defined for command "get".');
  });
});
