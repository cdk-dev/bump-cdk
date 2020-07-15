"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arg_1 = __importDefault(require("arg"));
const package_json_1 = __importDefault(require("../package.json"));
const lib_1 = require("../lib");
const args = arg_1.default({
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
    console.log(`create-cdk-app v${package_json_1.default.version}`);
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
    const version = args['--version'];
    const debug = args['--debug'];
    const dryRun = args['--dry-run'];
    const cwd = args._[0] || process.cwd();
    await lib_1.bumpCdk(cwd, version, dryRun, debug);
    process.exit(0);
}
run();
