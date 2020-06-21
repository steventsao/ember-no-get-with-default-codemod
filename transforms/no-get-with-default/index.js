const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const GET_WITH_DEFAULT = 'getWithDefault';

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const output = j(file.source);
  const options = getOptions();
  let emberObjectImports;

  function transformGetWithDefaultOnMemberExpression(path) {
    const [key, value] = path.value.arguments;
    const obj = path.value.callee.object;

    if (options.nullishCoalescing) {
      return j.logicalExpression('??', j.callExpression(j.identifier('get'), [obj, key]), value);
    }
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

    if (options.nullishCoalescing) {
      return j.logicalExpression('??', j.callExpression(j.identifier('get'), [obj, key]), value);
    }

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
  emberObjectImports = output.find(j.ImportDeclaration, {
    source: {
      type: 'StringLiteral',
      value: '@ember/object',
    },
  });
  const hasImportGet = !!emberObjectImports.find(j.Identifier, { name: 'get' }).length;

  if (hasEmberGet) {
    const importSpecifierGet = j.importSpecifier(j.identifier('get'));

    if (emberObjectImports.length) {
      if (!hasImportGet) {
        emberObjectImports.get('specifiers').push(importSpecifierGet);
      }
    } else {
      const importStatement = j.importDeclaration([importSpecifierGet], j.literal('@ember/object'));
      const body = output.get().value.program.body;

      body.unshift(importStatement);
    }
  }

  emberObjectImports.find(j.ImportSpecifier).forEach((nodePath) => {
    if (nodePath.node.imported.name === GET_WITH_DEFAULT) {
      j(nodePath).remove();
    }
  });

  return output.toSource();
};
