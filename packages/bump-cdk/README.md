# bump-cdk

## Quickstart

Run `bump-cdk` in a directory with a `package.json` that contains [AWS CDK Dependencies](). After running, you should see your cdk dependencies pinned and updated!

```bash
$ npm i -g bump-cdk
or
$ yarn global add bump-cdk
or
$ npx bump-cdk
```

## Why does this exist

A common issue when working with [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) is a version mismatch issue. Because of the way CDK's modules interface together, they must always be on the same version as each other [More Information](https://docs.aws.amazon.com/cdk/latest/guide/troubleshooting.html#troubleshooting_modules).

This for example might cause an error:

```json
{
    "dependencies": {
        "@aws-cdk/core": "1.30.0",
        "@aws-cdk/aws-lambda": "1.51.0"
    }
}
```

This introduces maintenance overhead by forcing you to always have your CDK dependencies matching.

Additionally, because of of NPM/Yarn behavior, when you add dependencies, you often end up with fluid version ranges. [More Information](https://docs.npmjs.com/files/package.json#dependencies).

Example:

```bash
$ yarn add @aws-cdk/core
{
    "dependencies": {
        "@aws-cdk/core": "^1.30.0"
    }
}
```

This means that the module is "Compatible with version" `1.30.0`, but this version will be set in the lockfile, and dependencies added at a later date can get out of sync.

As a result of this, [it is recommended](https://github.com/aws/aws-cdk/issues/3711) to pin the versions without the semver range modifier.

## Usage

### Cli

```bash
Usage
  $ bump-cdk <project-directory>
Options
  --version, -v   Version to set cdk to
  --dry-run       Outputs changes, but doesn't modify any files
  --help, -h      Displays this message
  --debug, -d     Enable verbose logging
```

### Programatic

Minimal Example:

```typescript
import { bumpCdk } from 'bump-cdk';

await bumpCdk(process.cwd());
```

This defaults `debug` and `dryRun` mode as well as pulls the latest version of `aws-cdk` from NPM and sets all dependencies to that version.

You can also pass in some other options:

```typescript
import { bumpCdk } from 'bump-cdk';

await bumpCdk(process.cwd(), '1.51.0', true, true);
```

This enables `debug` mode and `dryRun` mode as well as sets the specific version of `aws-cdk` to use.

## Contributing

Pull requests welcome!