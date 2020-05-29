const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const GET_WITH_DEFAULT = 'getWithDefault';

module.exports = function transformer(file, api) {
  const j = getParser(api);
  function transformGetWithDefaultOnThisExpression(path) {
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
  function transformStandAloneEmberGetWithDefault(path) {
    console.log({ path });
    const [obj, key, value] = path.value.arguments;
    return j.conditionalExpression(
      j.binaryExpression(
        '!==',
        j.callExpression(j.identifier('get'), [obj, key]),
        j.identifier('undefined')
      ),
      j.callExpression(j.identifier('get'), [obj, key]),
      value
    );
  }

  const output = j(file.source);
  // TODO confirm it's from THIS
  output
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: {
          type: 'Identifier',
          name: GET_WITH_DEFAULT,
        },
      },
    })
    .replaceWith(transformGetWithDefaultOnThisExpression);

  output
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: GET_WITH_DEFAULT,
      },
    })
    .replaceWith(transformStandAloneEmberGetWithDefault);

  return output.toSource();
};
