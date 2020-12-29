import { promises as fs } from 'fs';
import { join } from 'path';
import { error, fileExists } from './utils';

type GenericObject = {
  [key: string]: string;
};

const dependencyKeys = [
  'dependencies',
  'peerDependencies',
  'devDependencies',
  'bundledDependencies',
  'optionalDependencies',
];

export interface PackageJson {
  dependencies?: GenericObject;
  devDependencies?: GenericObject;
  peerDependencies?: GenericObject;
  buildDependencies?: GenericObject;
  optionalDependencies?: GenericObject;
}

const cdkPackagePatterns = [/[@]?aws-cdk[/]?/];

async function processDependencies(
  dependencies: GenericObject,
  version: string,
  debug = false,
) {
  if (debug) {
    console.log('processing');
  }
  let response = Object.assign({}, dependencies);
  for (const packageName in dependencies) {
    if (debug) {
      console.log(`Processing: ${packageName}`);
    }
    const currentPackage = dependencies[packageName];

    cdkPackagePatterns.forEach((pattern) => {
      if (packageName.match(pattern)) {
        if (currentPackage === version) {
          if (debug) {
            console.log(`${packageName} already up to date`);
          }
          return;
        }

        if (debug) {
          console.log(
            `Updating ${packageName}@${currentPackage} -> ${version}`,
          );
        }

        response[packageName] = version;
      }
    });
  }
  return response;
}

async function getLatestCDKVersion(): Promise<string> {
  /* eslint-disable */
  const pj = require('package-json');
  const { version } = await pj('aws-cdk');
  return version;
}

export async function bumpCdk(
  cwd: string,
  version?: string,
  dryRun = false,
  debug = false,
): Promise<void> {
  if (debug) {
    console.log('running in debug mode');
  }

  const packageJsonPath = join(cwd, 'package.json');

  if (!(await fileExists(packageJsonPath))) {
    error(`tried to use ${packageJsonPath}, but it does not exist`);
  }

  if (debug) {
    console.log(`using package.json at path: ${packageJsonPath}`);
  }

  const versionToUse = version || (await getLatestCDKVersion());

  if (debug) {
    console.log(`using CDK version: ${versionToUse}`);
  }

  const packageJson = require(packageJsonPath);
  const original = Object.assign({}, packageJson);

  await Promise.all(
    dependencyKeys
      .filter((key) => packageJson[key])
      .map(async (key) => {
        return new Promise(async (resolve, reject) => {
          try {
            if (debug) {
              console.log(`processing: ${key}`);
            }
            const dependencyBlock = await processDependencies(
              packageJson[key],
              versionToUse,
              debug,
            );
            packageJson[key] = dependencyBlock;
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }),
  );

  const hasChanges = original !== packageJson;

  const formattedFile = JSON.stringify(packageJson, null, 2);

  if (!dryRun) {
    if (hasChanges) {
      if (debug) {
        console.log('writing changes');
      }

      await fs.writeFile(packageJsonPath, formattedFile);

      console.log('package.json updated');

      return Promise.resolve();
    } else {
      console.log('No changes');
      process.exit(0);
    }
  } else {
    console.log(formattedFile);
    return Promise.resolve();
  }
}

export default bumpCdk;
