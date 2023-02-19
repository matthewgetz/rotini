vi.mock('fs');

import Configuration from './configuration';

describe('Configuration', () => {
  // describe('$HOME unset', () => {
  //   beforeEach(() => {
  //     vi.mock('os', () => ({
  //       homedir: vi.fn().mockImplementationOnce(() => undefined),
  //     }));
  //   });

  //   it('throws when $HOME is unset', () => {
  //     expect(() => {
  //       new Configuration({ directory: '.rotini', file: 'config.json', });
  //     }).toThrowError('$HOME is unset; unable to use program configuration file.');
  //   });
  // });

  describe('setConfigurationFile', () => {
    beforeEach(() => {
      vi.mock('os', () => ({
        homedir: vi.fn().mockImplementation(() => '/users/user'),
      }));
    });

    it('throws when configuration property "directory" and "file" have not been set', () => {
      expect(() => {
        // @ts-expect-error configuration properties "directory" and "file" are undefined
        new Configuration({}).getConfigurationFile();
      }).toThrowError('Configuration properties "directory" and "file" must be defined and of type "string" to interact with the program configuration file.');
    });

    it('throws when configuration property "directory" has not been set', () => {
      expect(() => {
        // @ts-expect-error configuration property directory is undefined
        new Configuration({ directory: '.rotini', }).getConfigurationFile();
      }).toThrowError('Configuration properties "directory" and "file" must be defined and of type "string" to interact with the program configuration file.');
    });

    it('throws when configuration property "directory" is boolean', () => {
      expect(() => {
        // @ts-expect-error configuration property directory is boolean
        new Configuration({ directory: false, }).getConfigurationFile();
      }).toThrowError('Configuration property "directory" must be of type "string".');
    });

    it('throws when configuration property "directory" is number', () => {
      expect(() => {
        // @ts-expect-error configuration property directory is number
        new Configuration({ directory: 657, }).getConfigurationFile();
      }).toThrowError('Configuration property "directory" must be of type "string".');
    });

    it('throws when configuration property "directory" is object', () => {
      expect(() => {
        // @ts-expect-error configuration property "directory" is object
        new Configuration({ directory: { some: 'property ', }, }).getConfigurationFile();
      }).toThrowError('Configuration property "directory" must be of type "string".');
    });

    it('throws when configuration property "file" has not been set', () => {
      expect(() => {
        // @ts-expect-error configuration properties directory and file are undefined
        new Configuration({ file: 'config.json', }).getConfigurationFile();
      }).toThrowError('Configuration properties "directory" and "file" must be defined and of type "string" to interact with the program configuration file.');
    });

    it('throws when configuration property "file" is boolean', () => {
      expect(() => {
        // @ts-expect-error configuration property file is boolean
        new Configuration({ file: false, }).getConfigurationFile();
      }).toThrowError('Configuration property "file" must be of type "string".');
    });

    it('throws when configuration property "file" is number', () => {
      expect(() => {
        // @ts-expect-error configuration property "file" is number
        new Configuration({ file: 657, }).getConfigurationFile();
      }).toThrowError('Configuration property "file" must be of type "string".');
    });

    it('throws when configuration property "file" is object', () => {
      expect(() => {
        // @ts-expect-error configuration property "file" is object
        new Configuration({ file: { some: 'property ', }, }).getConfigurationFile();
      }).toThrowError('Configuration property "file" must be of type "string".');
    });
  });

  // describe('getConfigurationFile', () => {
  // });
});
