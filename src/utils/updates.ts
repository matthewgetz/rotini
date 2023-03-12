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
  const result = await fetch(`${registry}/${package_name}`);

  const data = await result.json() as { versions: string[] };
  const packageVersions = Object.keys(data.versions);
  const filteredPackageVersions = packageVersions.filter(v => /^\d+(\.\d+)*$/.test(v.toString()));
  const latestVersion = filteredPackageVersions[filteredPackageVersions.length - 1];

  const [ currentMajor, currentMinor, currentPatch, ] = current_version.split('.').map(n => Number(n));
  const [ latestMajor, latestMinor, latestPatch, ] = latestVersion.split('.').map(n => Number(n));

  let hasUpdate = false;
  if (
    (latestMajor > currentMajor)
    || (latestMajor === currentMajor && latestMinor > currentMinor)
    || (latestMajor === currentMajor && latestMinor === currentMinor && latestPatch > currentPatch)
  ) {
    hasUpdate = true;
  }

  return { hasUpdate, latestVersion, };
};

export const updatePackage = async ({ package_name, version, }: { package_name: string, version: string }): Promise<void> => {
  console.info(`Installing version ${version} for ${package_name}...`);
  await execute(`npm install -g ${package_name}@${version} --registry=${registry}`);
  console.info('Done.');
};
