import ConfigurationFile from './configuration-file';

describe('Configuration', () => {
  describe('setConfigurationFile', () => {
    it('throws when configuration property "id" is undefined', () => {
      expect(() => {
        // @ts-expect-error configuration properties "directory" and "file" are undefined
        new ConfigurationFile({}).getContent();
      }).toThrowError('Configuration property "id" must be defined, of type string, and cannot contain spaces.');
    });

    it('throws when configuration property "directory" is unset', () => {
      expect(() => {
        // @ts-expect-error configuration properties "directory" and "file" are undefined
        new Configuration({ id: 'test', }).getContent();
      }).toThrowError('Configuration property "directory" must be defined and of type "string".');
    });

    it('throws when configuration property "file" is unset', () => {
      expect(() => {
        // @ts-expect-error configuration properties "directory" and "file" are undefined
        new Configuration({ id: 'test', directory: '.rotini', }).getContent();
      }).toThrowError('Configuration property "file" must be defined and of type "string".');
    });
  });

  // describe('getConfigurationFile', () => {
  // });
});
