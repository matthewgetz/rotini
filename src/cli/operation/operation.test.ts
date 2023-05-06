import { StrictOperation, } from './operation';
import { ConfigurationFiles, } from '../configuration-files';

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

  it('returns operation', async () => {
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
    }).toThrowError('Operation property "timeout" must be of type "number" and cannot be less than 0ms.');
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
    }).toThrowError('Operation property "timeout" must be of type "number" and cannot be less than 0ms.');
  });
});
