import { packageHasUpdate, updatePackage, } from './updates';
import * as child_process from 'child_process';

global.fetch = vi.fn();
vi.mock('child_process');

const createFetchResponse = (data: unknown): { json: Function } => {
  return {
    json: (): Promise<unknown> => new Promise((resolve) => resolve(data)),
  };
};

describe('updates', () => {
  describe('packageHasUpdate', () => {
    it('has package patch update', async () => {
      // @ts-expect-error allow mockResolvedValue
      global.fetch.mockResolvedValue(createFetchResponse({ version: '1.2.3', }));
      const result = await packageHasUpdate({ package_name: 'rotini', current_version: '1.2.2', });
      expect(result.hasUpdate).toBe(true);
      expect(result.latestVersion).toBe('1.2.3');
    });

    it('has package minor update', async () => {
      // @ts-expect-error allow mockResolvedValue
      global.fetch.mockResolvedValue(createFetchResponse({ version: '1.4.0', }));
      const result = await packageHasUpdate({ package_name: 'rotini', current_version: '1.2.2', });
      expect(result.hasUpdate).toBe(true);
      expect(result.latestVersion).toBe('1.4.0');
    });

    it('has package major update', async () => {
      // @ts-expect-error allow mockResolvedValue
      global.fetch.mockResolvedValue(createFetchResponse({ version: '2.0.1', }));
      const result = await packageHasUpdate({ package_name: 'rotini', current_version: '1.2.2', });
      expect(result.hasUpdate).toBe(true);
      expect(result.latestVersion).toBe('2.0.1');
    });

    it('does not have package update', async () => {
      // @ts-expect-error allow mockResolvedValue
      global.fetch.mockResolvedValue(createFetchResponse({ version: '1.2.3', }));
      const result = await packageHasUpdate({ package_name: 'rotini', current_version: '1.2.4', });
      expect(result.hasUpdate).toBe(false);
      expect(result.latestVersion).toBe('1.2.3');
    });
  });

  describe('updatePackage', () => {
    it('calls child_process.exec, resolves, and outputs to console', async () => {
      const info = vi.spyOn(console, 'info').mockImplementation(() => {});
      // @ts-expect-error allow mockImplementation
      child_process.exec.mockImplementation((command, callback) => callback(null, 'stdout', null));

      await updatePackage({ package_name: 'rotini', version: '1.2.3', });
      expect(child_process.exec).toHaveBeenCalledTimes(1);
      expect(child_process.exec).toHaveBeenCalledWith('npm install -g rotini@1.2.3 --registry=https://registry.npmjs.org', expect.any(Function));
      expect(info).toHaveBeenCalledTimes(2);
      expect(info).toHaveBeenCalledWith('Installing version 1.2.3 for "rotini"...');
      expect(info).toHaveBeenLastCalledWith('Done.');
    });
  });

  it('calls child_process.exec, rejects error, and outputs to console', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    // @ts-expect-error allow mockImplementation
    child_process.exec.mockImplementation((command, callback) => callback('error', null, null));

    let result;
    try {
      await updatePackage({ package_name: 'rotini', version: '1.2.3', });
    } catch (e) {
      result = e;
    }

    expect(result).toBe(undefined);
    expect(child_process.exec).toHaveBeenCalledTimes(1);
    expect(child_process.exec).toHaveBeenCalledWith('npm install -g rotini@1.2.3 --registry=https://registry.npmjs.org', expect.any(Function));
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('error');
  });

  it('calls child_process.exec, rejects stderr, and outputs to console', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    // @ts-expect-error allow mockImplementation
    child_process.exec.mockImplementation((command, callback) => callback(null, null, 'stderr'));

    let result;
    try {
      await updatePackage({ package_name: 'rotini', version: '1.2.3', });
    } catch (e) {
      result = e;
    }

    expect(result).toBe(undefined);
    expect(child_process.exec).toHaveBeenCalledTimes(1);
    expect(child_process.exec).toHaveBeenCalledWith('npm install -g rotini@1.2.3 --registry=https://registry.npmjs.org', expect.any(Function));
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('stderr');
  });
});
