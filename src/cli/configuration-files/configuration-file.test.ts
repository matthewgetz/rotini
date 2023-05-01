import * as fs from 'fs';

import { OperationError, } from '../errors';
import { StrictConfigurationFile, } from './configuration-file';

vi.mock('fs', () => {
  return {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
});

describe('Configuration', () => {
  describe('ConfigurationFile', () => {
    it('throws when configuration property "id" is undefined', () => {
      expect(() => {
        // @ts-expect-error configuration properties "directory" and "file" are undefined
        new StrictConfigurationFile({});
      }).toThrowError('Configuration property "id" must be defined, of type string, and cannot contain spaces.');
    });

    it('throws when configuration property "directory" is unset', () => {
      expect(() => {
        // @ts-expect-error configuration properties "directory" and "file" are undefined
        new StrictConfigurationFile({ id: 'test', });
      }).toThrowError('Configuration property "directory" must be defined and of type "string".');
    });

    it('throws when configuration property "file" is unset', () => {
      expect(() => {
        // @ts-expect-error configuration properties "directory" and "file" are undefined
        new StrictConfigurationFile({ id: 'test', directory: '.rotini', });
      }).toThrowError('Configuration property "file" must be defined and of type "string".');
    });

    it('does not throw', () => {
      expect(() => {
        new StrictConfigurationFile({ id: 'test', directory: '.rotini', file: 'config.json', });
      }).not.toThrow();
    });

    it('sets the file content', () => {
      const config = new StrictConfigurationFile({ id: 'test', directory: '.rotini', file: 'config.json', });
      const error = new Error('write error');
      const json_error = new OperationError('Configuration file ".rotini/config.json" data is not JSON.');

      const mockWriteFileSync = vi.spyOn(fs, 'writeFileSync')
        .mockImplementationOnce(() => {})
        .mockImplementationOnce(() => { throw error; });

      const firstResult = config.setContent({
        name: 'rotini',
        test: 'set content',
      });

      expect(firstResult.hasError).toBe(false);
      expect(firstResult.error).toBe(undefined);

      expect(mockWriteFileSync).toHaveBeenCalledTimes(1);
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '.rotini/config.json',
        `{\n  "name": "rotini",\n  "test": "set content"\n}`
      );

      const secondResult = config.setContent({
        name: 'rotini',
        test: 'set content',
      });

      expect(secondResult.hasError).toBe(true);
      expect(secondResult.error).toBe(error);

      // @ts-expect-error data is not object
      const thirdResult = config.setContent('');

      expect(thirdResult.hasError).toBe(true);
      expect(thirdResult.error).toStrictEqual(json_error);
    });

    it('gets the file content', () => {
      const config = new StrictConfigurationFile({ id: 'test', directory: '.rotini', file: 'config.json', });
      const error = new Error('read failure');

      const mockReadFileSync = vi.spyOn(fs, 'readFileSync')
        .mockImplementationOnce(() => '{"is":"json"}')
        .mockImplementationOnce(() => { throw error; });

      const firstResult = config.getContent();

      expect(mockReadFileSync).toHaveBeenCalledTimes(1);
      expect(firstResult.hasError).toBe(false);
      expect(firstResult.error).toBe(undefined);
      expect(firstResult.data).toStrictEqual({ is: 'json', });

      const secondResult = config.getContent();

      expect(mockReadFileSync).toHaveBeenCalledTimes(2);
      expect(secondResult.hasError).toBe(true);
      expect(secondResult.error).toBe(error);
      expect(secondResult.data).toBe(undefined);
    });
  });
});
