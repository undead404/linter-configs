import { exec } from 'child_process';
import { constants, createWriteStream } from 'fs';
import {
  access,
  mkdir,
  readdir,
  readFile,
  unlink,
  writeFile,
} from 'fs/promises';
import { get } from 'https';
import path from 'path';

const MIN_NODE_VERSION = 12;

const nodeVersion = process.versions.node.split('.')[0];
if (Number.parseInt(nodeVersion, 10) < MIN_NODE_VERSION) {
  console.error('Node.js version < 12, not supported');
  process.exit(1);
}

function download(url, dir = '.', fileName = null) {
  const urlParts = url.split('/');
  const file = createWriteStream(path.join(dir, fileName || urlParts.at(-1)));
  return new Promise((resolve, reject) =>
    get(url, function (response) {
      if (response.statusCode >= 400) {
        console.error(
          `Failed to download from ${url}: ${response.statusCode} ${response.statusMessage}`,
        );
        process.exit(1);
      }
      response.pipe(file).on('close', resolve).on('error', reject);
    }).on('error', reject),
  );
}

async function execute(command) {
  console.debug(command);
  const statusCode = await new Promise((resolve, reject) => {
    const process = exec(command);
    process.on('error', reject);
    process.on('close', resolve);
    process.stdout.on('data', (data) => console.debug(data));
    process.stderr.on('data', (data) => console.warn(data));
  });

  if (statusCode) {
    throw new Error('Failure');
  }
}

async function exists(fileName) {
  try {
    await access('yarn.lock', constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.debug('main()');
  const USE_YARN = await exists('yarn.lock');
  let packageJson = await readFile('package.json');
  let packageData = JSON.parse(packageJson);
  const USE_REACT = packageData.dependencies && packageData.dependencies.react;
  const USE_TYPESCRIPT = await exists('tsconfig.json');
  const packages = [
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-array-func',
    'eslint-plugin-editorconfig',
    'eslint-plugin-eslint-comments',
    'eslint-plugin-import',
    'eslint-plugin-jest',
    'eslint-plugin-prettier',
    'eslint-plugin-simple-import-sort',
    'eslint-plugin-promise',
    'eslint-plugin-unicorn',
    'jest',
    'prettier',
  ];
  if (USE_REACT) {
    packages.push(
      'eslint-config-airbnb',
      'eslint-plugin-compat',
      'eslint-plugin-postcss-modules',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-react-perf',
      'eslint-plugin-react-redux',
      'stylelint',
      'stylelint-config-standard',
      'stylelint-order',
    );
  } else {
    packages.push(
      'eslint-config-airbnb-base',
      'eslint-plugin-node',
      'eslint-plugin-security-node',
    );
  }
  if (USE_TYPESCRIPT) {
    packages.push(
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
    );
  }

  packages.sort();
  await (USE_YARN
    ? execute(`yarn add -D ${packages.join(' ')}`)
    : execute(`npm i -D ${packages.join(' ')}`));
  packageJson = await readFile('package.json');
  packageData = JSON.parse(packageJson);
  await Promise.all(
    (await readdir('.'))
      .filter(
        (fileName) =>
          /^\.eslintrc(\..*)?$/.test(fileName) ||
          /^\.prettierrc(\..*)?$/.test(fileName),
      )
      .map((fileName) => unlink(path.join('.', fileName))),
  );
  await download(
    'https://raw.githubusercontent.com/undead404/linter-configs/main/.editorconfig',
  );
  await download(
    'https://raw.githubusercontent.com/undead404/linter-configs/main/.eslintignore',
  );
  await download(
    'https://raw.githubusercontent.com/undead404/linter-configs/main/.prettierrc.cjs',
  );
  if (USE_REACT) {
    await (USE_TYPESCRIPT
      ? download(
          'https://raw.githubusercontent.com/undead404/linter-configs/main/react-typescript/.eslintrc.js',
        )
      : download(
          'https://raw.githubusercontent.com/undead404/linter-configs/main/react/.eslintrc.js',
        ));
    await download(
      'https://raw.githubusercontent.com/undead404/linter-configs/main/react/.stylelintignore',
    );
    await download(
      'https://raw.githubusercontent.com/undead404/linter-configs/main/react/.stylelintrc.js',
    );
  } else if (USE_TYPESCRIPT) {
    await download(
      'https://raw.githubusercontent.com/undead404/linter-configs/main/node-typescript/.eslintrc.js',
    );
  } else {
    await download(
      'https://raw.githubusercontent.com/undead404/linter-configs/main/node/.eslintrc.js',
    );
  }
  if (!(await exists('.vscode'))) {
    try {
      await mkdir('.vscode');
    } catch (error) {
      if (!error.toString().includes('file already exists')) {
        throw error;
      }
    }
  }
  await download(
    'https://raw.githubusercontent.com/undead404/linter-configs/main/vscode-settings.json',
    '.vscode',
    'settings.json',
  );
  delete packageData.eslintConfig;
  const newScripts = USE_REACT
    ? {
        fix: USE_TYPESCRIPT
          ? 'NODE_ENV=development eslint src --ext .ts --ext .tsx --fix'
          : 'NODE_ENV=development eslint src --ext .js --ext .jsx --fix',
        lint: USE_TYPESCRIPT
          ? 'NODE_ENV=development eslint src --ext .ts --ext .tsx'
          : 'NODE_ENV=development eslint src --ext .js --ext .jsx',
      }
    : {
        fix: 'eslint src --fix',
        lint: 'eslint src',
      };
  packageData.scripts = {
    ...packageData.scripts,
    ...newScripts,
  };
  await writeFile('package.json', JSON.stringify(packageData, null, 2));
  await (USE_YARN ? execute('yarn fix') : execute('npm run fix'));
}

void main();
