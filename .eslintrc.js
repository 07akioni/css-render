module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint'
      ],
      extends: [
        'standard-with-typescript'
      ],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        '@typescript-eslint/no-floating-promises': 0
      }
    },
    {
      files: ['*.js'],
      extends: 'standard',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    }
  ]
}
