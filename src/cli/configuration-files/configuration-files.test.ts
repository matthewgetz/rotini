import { ConfigurationError, } from '../errors';
import { ConfigurationFiles, } from './configuration-files';

describe('ConfigurationFiles', () => {
  it('returns configuration files', () => {
    const configs = new ConfigurationFiles([
      {
        id: 'rotini',
        directory: './configs',
        file: 'rotini.json',
      },
      {
        id: 'test',
        directory: '/test',
        file: 'test.json',
      },
    ]);

    const configuration_files = configs.configuration_files;
    const { getContent: firstGetContent, setContent: firstSetContent, } = configs.getConfigurationFile('rotini');
    const { getContent: secondGetContent, setContent: secondSetContent, } = configs.getConfigurationFile('test');

    expect(configuration_files.length).toBe(2);

    const [ first, second, ] = configuration_files;

    expect(first.id).toBe('rotini');
    expect(first.directory).toBe('./configs');
    expect(first.file).toBe('rotini.json');
    expect(first.getContent).toBeTypeOf('function');
    expect(first.setContent).toBeTypeOf('function');
    expect(firstGetContent).toBeTypeOf('function');
    expect(firstSetContent).toBeTypeOf('function');

    expect(second.id).toBe('test');
    expect(second.directory).toBe('/test');
    expect(second.file).toBe('test.json');
    expect(second.getContent).toBeTypeOf('function');
    expect(second.setContent).toBeTypeOf('function');
    expect(secondGetContent).toBeTypeOf('function');
    expect(secondSetContent).toBeTypeOf('function');
  });

  it('throws when duplicate config ids are passed', () => {
    const error = new ConfigurationError('Duplicate configuration file ids found: ["rotini"].');

    expect(() => {
      new ConfigurationFiles([
        {
          id: 'rotini',
          directory: './configs',
          file: 'rotini.json',
        },
        {
          id: 'rotini',
          directory: '/test',
          file: 'test.json',
        },
      ]);
    }).toThrowError(error);
  });

  it('throws when unknown id passed', () => {
    const error = new ConfigurationError('Unknown configuration file id "bad id".');

    const configs = new ConfigurationFiles([
      {
        id: 'rotini',
        directory: './configs',
        file: 'rotini.json',
      },
      {
        id: 'test',
        directory: '/test',
        file: 'test.json',
      },
    ]);

    expect(() => {
      configs.getConfigurationFile('bad id');
    }).toThrowError(error);
  });
});
