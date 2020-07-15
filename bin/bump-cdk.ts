import arg from 'arg';
import packageJson from '../package.json';

import { bumpCdk } from '../lib';

const args = arg({
  // Types
  '--help': Boolean,
  '--version': String,
  '--debug': Boolean,
  '--dry-run': Boolean,

  // Aliases
  '-v': '--version',
  '-h': '--help',
  '-d': '--debug',
});

if (args['--version']) {
  console.log(`create-cdk-app v${packageJson.version}`);
  process.exit(0);
}

const help = `
Usage
  $ bump-cdk <project-directory>
Options
  --version, -v   Version to set cdk to
  --dry-run       Outputs changes, but doesn't modify any files
  --help, -h      Displays this message
  --debug, -d     Enable verbose logging
`;

if (args['--help']) {
  console.log(help);
  process.exit(0);
}

async function run() {
    const version  = args['--version'];
    const debug = args['--debug'];
    const dryRun = args['--dry-run'];
    const cwd = args._[0] || process.cwd();
    await bumpCdk(cwd, version, dryRun, debug);
    process.exit(0);
}

run();