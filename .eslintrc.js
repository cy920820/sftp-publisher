module.exports = {
  "extends": "standard",
  "env": {
    "node": true,
    "es6": true,
    "jest": true
  },
  "rules": {
    "indent": ["error", 2, {
      "MemberExpression": 0
    }],
    "space-before-function-paren": 0,
    "no-console": 2,
    "standard/no-callback-literal": 0,
    "brace-style": 0,
    "object-curly-spacing": [2, "always"],
    "no-empty-function": 2
  }
}
