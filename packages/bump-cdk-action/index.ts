const core = require('@actions/core');
const github = require('@actions/github');
const { BumpCdk } = require('@cdk-tools/bump-cdk');

try {
  const explicitVersion = core.getInput('version');

  const version = explicitVersion || 'latest';

  core.setOutput("version", version);
} catch (error) {
  core.setFailed(error.message);
}
