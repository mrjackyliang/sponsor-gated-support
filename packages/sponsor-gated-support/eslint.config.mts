import {
  dxCodeStyle,
  dxIgnore,
  langJavascript,
  langTypescript,
  novaRules,
  runtimeNode,
} from '@cbnventures/nova/presets/eslint';

/**
 * ESLint Configuration.
 *
 * Defines the full set of custom lint rules and presets used
 * across all source files in this package.
 *
 * @since 1.0.1
 */
export default [
  ...dxIgnore,
  ...dxCodeStyle,
  ...langJavascript,
  ...langTypescript,
  ...runtimeNode,
  {
    name: 'custom-ignores',
    ignores: ['./build/**'],
  },
  {
    name: 'custom-tsconfig',
    files: [
      '**/*.cts',
      '**/*.mts',
      '**/*.ts',
      '**/*.tsx',
    ],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.json',
          './tsconfig.config.json',
          './tsconfig.tests.json',
        ],
      },
    },
  },
  ...novaRules,
  {
    name: 'custom-nova-rules',
    files: [
      '**/*.cjs',
      '**/*.cts',
      '**/*.js',
      '**/*.jsx',
      '**/*.mjs',
      '**/*.mts',
      '**/*.ts',
      '**/*.tsx',
    ],
    rules: {
      '@cbnventures/nova/no-shared-type-import': [
        'error',
        {
          ignoreFiles: [],
          sharedFiles: ['./src/types/shared.d.ts'],
        },
      ],
      '@cbnventures/nova/require-jsdoc-body': [
        'error',
        {
          ignoreFiles: [
            './eslint.config.mts',
            './vitest.config.mts',
          ],
          maxLines: 3,
          maxWidth: 90,
          minLines: 2,
          skipDirectories: [
            'styles',
            'tests',
            'types',
          ],
        },
      ],
      '@cbnventures/nova/require-jsdoc-hierarchy': [
        'error',
        {
          anchorDirectories: [
            'src',
            'utils',
          ],
          ignoreFiles: [
            './eslint.config.mts',
            './vitest.config.mts',
            './vitest.setup.ts',
          ],
          knownNames: {},
          stripDirectories: ['types'],
        },
      ],
      '@cbnventures/nova/require-jsdoc-presence': [
        'error',
        {
          ignoreFiles: [
            './eslint.config.mts',
            './vitest.config.mts',
          ],
          skipDirectories: [
            'tests',
            'types',
          ],
        },
      ],
    },
  },
];
