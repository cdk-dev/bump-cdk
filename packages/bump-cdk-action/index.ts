const core = require('@actions/core');
const github = require('@actions/github');
const { bumpCdk } = require('bump-cdk');

async function run() {
  try {
    const workingDirectory = core.getInput('working-directory') || process.cwd();
    const explicitVersion = core.getInput('version') || undefined;
    const debug = core.getInput('debug') || false;
    const version = explicitVersion;

    await bumpCdk(workingDirectory, version, false, debug);

    core.setOutput('version', version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
