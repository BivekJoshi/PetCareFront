module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // This project validates props by convention/runtime rather than PropTypes
    // (no component declares propTypes), so the rule is disabled project-wide
    // instead of being silenced file-by-file.
    'react/prop-types': 'off',
  },
  overrides: [
    {
      // react-three-fiber maps three.js props (args, uniforms, shaders, …)
      // onto intrinsic elements, which eslint-plugin-react flags as unknown.
      files: ['**/DashboardBackground.jsx', '**/AuthBackground.jsx', '**/PetField.jsx'],
      rules: { 'react/no-unknown-property': 'off' },
    },
    {
      // Context modules intentionally export their provider component alongside
      // a consumer hook (and the odd constant); that is the standard pattern,
      // so the fast-refresh-only lint does not apply here.
      files: ['**/context/**'],
      rules: { 'react-refresh/only-export-components': 'off' },
    },
  ],
}
