import { exec, } from 'child_process';

const registry = process.env.NPM_CONFIG_REGISTRY || 'https://registry.npmjs.org';

const execute = (command: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, _, stderr) => {
      if (error) {
        console.error(error);
        reject();
      }
      if (stderr) {
        console.error(stderr);
        reject();
      }
      resolve();
    });
  });
};

export const packageHasUpdate = async ({ package_name, current_version, }: { package_name: string, current_version: string }): Promise<{ hasUpdate: boolean, latestVersion: string }> => {
  const result = await fetch(`${registry}/${package_name}/latest`);

  const data = await result.json() as { version: string };
  const latest_version = data.version;

  const [ current_major, current_minor, current_patch, ] = current_version.split('.').map(n => Number(n));
  const [ latest_major, latest_minor, latest_patch, ] = latest_version.split('.').map(n => Number(n));

  let hasUpdate = false;
  if (
    (latest_major > current_major)
    || (latest_major === current_major && latest_minor > current_minor)
    || (latest_major === current_major && latest_minor === current_minor && latest_patch > current_patch)
  ) {
    hasUpdate = true;
  }

  return { hasUpdate, latestVersion: latest_version, };
};

export const updatePackage = async ({ package_name, version, }: { package_name: string, version: string }): Promise<void> => {
  console.info(`Installing version ${version} for "${package_name}"...`);
  await execute(`npm install -g ${package_name}@${version} --registry=${registry}`);
  console.info('Done.');
};
