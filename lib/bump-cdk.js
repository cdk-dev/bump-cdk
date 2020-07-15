"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bumpCdk = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const utils_1 = require("./utils");
const dependencyKeys = [
    'dependencies',
    'peerDependencies',
    'devDependencies',
    'bundledDependencies',
    'optionalDependencies',
];
const cdkPackagePatterns = [/[@]?aws-cdk[/]?/];
async function processDependencies(dependencies, version, debug = false) {
    if (debug) {
        console.log('processing');
    }
    let response = Object.assign({}, dependencies);
    for (const packageName in dependencies) {
        if (debug) {
            console.log(`Processing: ${packageName}`);
        }
        const currentPackage = dependencies[packageName];
        cdkPackagePatterns.forEach(pattern => {
            if (packageName.match(pattern)) {
                if (currentPackage === version) {
                    if (debug) {
                        console.log(`${packageName} already up to date`);
                    }
                    return;
                }
                if (debug) {
                    console.log(`Updating ${packageName}@${currentPackage} -> ${version}`);
                }
                response[packageName] = version;
            }
        });
    }
    return response;
}
async function getLatestCDKVersion(debug = false) {
    const pj = require('package-json');
    const { version } = await pj('aws-cdk');
    return version;
}
async function bumpCdk(cwd, version, dryRun = false, debug = false) {
    if (debug) {
        console.log('running in debug mode');
    }
    const packageJsonPath = path_1.join(cwd, 'package.json');
    if (!(await utils_1.fileExists(packageJsonPath))) {
        utils_1.error(`tried to use ${packageJsonPath}, but it does not exist`);
    }
    if (debug) {
        console.log(`using package.json at path: ${packageJsonPath}`);
    }
    const versionToUse = version || await getLatestCDKVersion(debug);
    if (debug) {
        console.log(`using CDK version: ${versionToUse}`);
    }
    const packageJson = require(packageJsonPath);
    const original = Object.assign({}, packageJson);
    await Promise.all(dependencyKeys
        .filter((key) => packageJson[key])
        .map(async (key) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (debug) {
                    console.log(`processing: ${key}`);
                }
                const dependencyBlock = await processDependencies(packageJson[key], versionToUse, debug);
                packageJson[key] = dependencyBlock;
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    }));
    const hasChanges = original !== packageJson;
    if (!hasChanges) {
        console.log('No changes');
        process.exit(0);
    }
    const formattedFile = JSON.stringify(packageJson, null, 2);
    if (!dryRun) {
        if (debug) {
            console.log('writing changes');
        }
        await fs_1.promises.writeFile(packageJsonPath, formattedFile);
        console.log('package.json updated');
        return Promise.resolve();
    }
    else {
        console.log(formattedFile);
        return Promise.resolve();
    }
}
exports.bumpCdk = bumpCdk;
exports.default = bumpCdk;
