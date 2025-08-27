import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import n from 'eslint-plugin-n'
import vue from 'eslint-plugin-vue'
import neostandard from 'neostandard'

export default [
    {
        ignores: ['dist/', 'resources/', 'ui/dist/', '*.svg', '*.xml']
    },

    js.configs.recommended,
    ...neostandard(),

    {
        languageOptions: {
            ecmaVersion: 2022
        },
        plugins: {
            import: importPlugin
        },
        rules: {
            '@stylistic/indent': ['error', 4, { SwitchCase: 0 }],
            'object-shorthand': ['error'],
            'sort-imports': [
                'error',
                {
                    ignoreDeclarationSort: true
                }
            ],
            'no-console': ['error', { allow: ['info', 'warn', 'error', 'debug'] }],

            // plugin:import
            'import/order': [
                'error',
                {
                    alphabetize: {
                        order: 'asc'
                    },
                    'newlines-between': 'always-and-inside-groups'
                }
            ],
            'import/no-unresolved': 'error'
        }
    },

    {
        files: ['nodes/**/*'],
        languageOptions: {
            sourceType: 'commonjs'
        },
        plugins: {
            n
        },
        rules: {
            'n/file-extension-in-import': 'error',
            'n/no-missing-import': 'error',
            'n/no-missing-require': 'error'
        }
    },

    ...vue.configs['flat/recommended'],
    {
        files: ['ui/**/*.vue', 'ui/**/*.js'],
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 2022
        },
        rules: {
            'vue/html-indent': ['error', 4],
            'vue/singleline-html-element-content-newline': 'off',
            'vue/max-attributes-per-line': 'off',
            'vue/attribute-hyphenation': 'off'
        }
    }
]
