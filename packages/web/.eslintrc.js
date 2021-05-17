module.exports = {
  //extends: 'airbnb-base',
  extends: 'react-app',
  parser: 'babel-eslint',
  rules: {
    'no-use-before-define': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
  plugins: ['react-hooks'],
};
