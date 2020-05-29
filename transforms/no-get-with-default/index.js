const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const GET_WITH_DEFAULT = 'getWithDefault';

module.exports = function transformer(file, api) {
  const j = getParser(api);
  function convertToConditionalExpression(path) {
    const [key, value] = path.value.arguments;
    return j.conditionalExpression(
      j.binaryExpression(
        '!==',
        j.callExpression(j.identifier('get'), [j.thisExpression(), key]),
        j.identifier('undefined')
      ),
      j.callExpression(j.identifier('get'), [j.thisExpression(), key]),
      value
    );
  }

  return j(file.source)
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: {
          type: 'Identifier',
          name: GET_WITH_DEFAULT,
        },
      },
    })
    .replaceWith(convertToConditionalExpression)
    .toSource();
};
