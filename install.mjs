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
const JSON_PADDING = 2;
const ERROR_CODE = 400;
const nodeVersion = process.versions.node.split('.')[0];
if (Number.parseInt(nodeVersion, 10) < MIN_NODE_VERSION) {
  console.error('Node.js version < 12, not supported');
  process.exit(1);
}

function download(url, directory = '.', fileName = null) {
  const urlParts = url.split('/');
  const file = createWriteStream(
    path.join(directory, fileName || urlParts[urlParts.length - 1]),
  );
  return new Promise((resolve, reject) =>
    get(url, (response) => {
      if (response.statusCode >= ERROR_CODE) {
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
    await access(fileName, constants.F_OK);
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
  const USE_CRA =
    USE_REACT &&
    packageData.dependencies &&
    packageData.dependencies['react-scripts'];
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
      'deasync',
      'eslint-config-airbnb',
      'eslint-plugin-compat',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-postcss-modules',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-react-perf',
      'eslint-plugin-react-redux',
      'stylelint',
      'stylelint-config-standard',
      'stylelint-order',
    );
    if (!USE_TYPESCRIPT) {
      packages.push('@babel/eslint-parser', '@babel/preset-react');
    }
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
      'eslint-config-airbnb-typescript',
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
  await download(
    'https://raw.githubusercontent.com/undead404/linter-configs/main/react/.stylelintignore',
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
      'https://raw.githubusercontent.com/undead404/linter-configs/main/react/.stylelintrc.js',
    );
  } else if (USE_TYPESCRIPT) {
    await download(
      'https://raw.githubusercontent.com/undead404/linter-configs/main/node-typescript/.eslintrc.js',
    );
  } else {
    await download(
      'https://raw.githubusercontent.com/undead404/linter-configs/main/node/.eslintrc.cjs',
    );
  }
  if (USE_CRA) {
    await download(
      'https://raw.githubusercontent.com/undead404/linter-configs/main/react/babel.config.js',
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
  const scriptsToAdd = USE_REACT
    ? {
        fix: USE_TYPESCRIPT
          ? 'eslint . --ext .ts --ext .tsx --fix'
          : 'eslint . --ext .js --ext .jsx --fix',
        lint: USE_TYPESCRIPT
          ? 'eslint . --ext .ts --ext .tsx'
          : 'eslint . --ext .js --ext .jsx',
      }
    : {
        fix: 'eslint . --fix',
        lint: 'eslint .',
      };
  packageData.scripts = {
    ...packageData.scripts,
    ...scriptsToAdd,
  };
  await writeFile(
    'package.json',
    JSON.stringify(packageData, null, JSON_PADDING),
  );
  await (USE_YARN ? execute('yarn fix') : execute('npm run fix'));
}

void main();
