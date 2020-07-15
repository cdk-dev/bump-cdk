# Github Action for bump-cdk

This is a [GitHub Action] that creates a pull request with a version upgrade on CDK dependencies.

Because of the way CDK is compiled, all peer dependencies must be the same version. This causes a maintenance headache of not only bumping the versions, but also making sure they go together.

## Usage

Here is an example where we use the action on a daily schedule.

```yml
on:
  schedule:
    - cron: '0 12 * * *'

jobs:
  bump_cdk:
    runs-on: ubuntu-latest
    name: Bump CDK versions
    steps:
    - id: bump
      uses: @cdk-tools/bump-cdk-action@v1
```

## Options

Explicit Version

Strategy

Pattern
