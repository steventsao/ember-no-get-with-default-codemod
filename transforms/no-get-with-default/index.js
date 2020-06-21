const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const {
  transformGetWithDefaultOnMemberExpression,
  transformStandAloneEmberGetWithDefault,
} = require('./utils.js');

const GET_WITH_DEFAULT = 'getWithDefault';

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const output = j(file.source);
  const options = getOptions();
  let emberObjectImports;

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
    .replaceWith((path) => transformGetWithDefaultOnMemberExpression(path, j, options));

  output
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: GET_WITH_DEFAULT,
      },
    })
    .replaceWith((path) => transformStandAloneEmberGetWithDefault(path, j, options));

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
