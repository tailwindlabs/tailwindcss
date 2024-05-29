## Quick Start

### Step 1: Fork and clone the repository

Fork the github project by clicking on the fork button on the top of this page. This will create a copy of this repository in your account.

Clone your forked repository locally.

```bash
git clone git@github.com:[username]/tailwindcss.git
cd tailwindcss
git fetch
```

### Step 2: Create a branch

```
git checkout -b my-branch-name
```

### Step 3: Make changes

Make necessary changes in files to fix bugs etc.

### Step 4: Run the code

Run `bash npm install -g pnpm` to install pnpm on your system

Our code formatting rules are defined in the `"prettier"` section of [package.json](https://github.com/tailwindcss/tailwindcss/blob/next/package.json). You can check your code against these standards by running:

```sh
pnpm run lint
```

To automatically fix any style violations in your code, you can run:

```sh
pnpm run format
```

### Running tests

You can run the test suite using the following commands:

```sh
pnpm build && pnpm test
```

### Step 5: Commit

It is a best practice to keep your changes as logically grouped as possible within individual commits.

```
git add my/changed/files
```

#### Commit message

A commit message should describe what changed and why.

```
git commit -m "The body of the commit message, should explain what changed."
```

### Step 6: Push changes to Github

Once you are sure your commits are ready to go, with passing tests and formatting, begin the process of opening a pull request by pushing your working branch to your fork on GitHub.

```
git push -u origin my-branch-name
```

### Step 7: Submit the pull request

Go to your repository on Github, click the `Compare & pull request` button and then submit the pull request.
