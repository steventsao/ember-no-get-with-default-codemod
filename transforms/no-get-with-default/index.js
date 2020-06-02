const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const GET_WITH_DEFAULT = 'getWithDefault';

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const output = j(file.source);

  function transformGetWithDefaultOnMemberExpression(path) {
    const [key, value] = path.value.arguments;
    const obj = path.value.callee.object;

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
  function transformStandAloneEmberGetWithDefault(path) {
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
    .replaceWith(transformGetWithDefaultOnMemberExpression);

  output
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: GET_WITH_DEFAULT,
      },
    })
    .replaceWith(transformStandAloneEmberGetWithDefault);

  const hasEmberGet = !!output.find(j.CallExpression, {
    callee: {
      type: 'Identifier',
      name: 'get',
    },
  }).length;
  const emberObjectImports = output.find(j.ImportDeclaration, {
    source: {
      type: 'StringLiteral',
      value: '@ember/object',
    },
  });
  const hasImportGet = !!emberObjectImports.find(j.Identifier, { name: 'get' }).length;
  const importGetWithDefault = emberObjectImports.find(j.Identifier, { name: GET_WITH_DEFAULT });
  const hasImportGetWithDefault = !!emberObjectImports.find(j.Identifier, {
    name: GET_WITH_DEFAULT,
  }).length;
  importGetWithDefault.remove();
  if (!hasEmberGet) {
    debugger;
    if (!emberObjectImports.get('specifiers').length) {
      emberObjectImports.get('specifiers').push('get');
    } else {
      const importStatement = j.ImportDeclaration(['get'], j.literal('@ember/object'));
      const body = output.get().value.program.body;

      body.unshift(importStatement);
    }
  }

  return output.toSource();
};
