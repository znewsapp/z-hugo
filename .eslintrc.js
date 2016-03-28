module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: 'airbnb/base',
  'rules': {
    'semi': [2, 'never'],
    'no-console': [0],
    'no-param-reassign': [2, { 'props': false }],
  },
}