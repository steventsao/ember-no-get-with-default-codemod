const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const GET_WITH_DEFAULT = 'getWithDefault';
module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  function convertToConditionalExpression(path) {
    if (path.value.callee.property && path.value.callee.property.name === GET_WITH_DEFAULT) {
      const args = path.value.arguments.slice();

      return j.conditionalExpression(
        j.binaryExpression(
          '===',
          j.callExpression(j.identifier('get'), [j.thisExpression(), j.literal('key')]),
          j.identifier('undefined')
        ),
        j.callExpression(j.identifier('get'), [j.thisExpression(), j.literal('key')]),
        j.literal('default')
      );
    }
  }
  function transformStandaloneGet(source) {
    let emberObjectImport = j(source).find(j.ImportDeclaration, {
      source: {
        value: '@ember/object',
      },
    });
    const hasGetImport = emberObjectImport.find(j.ImportSpecifier, {
      local: {
        name: 'get',
      },
    }).length;

    // If there is relavant import statement
    if (emberObjectImport.length) {
      if (!hasGetImport) {
        return source;
      }
    } else {
      const root = j(source);
      const imports = root.find(j.ImportDeclaration);
      const s = j.importDeclaration(
        [j.importSpecifier(j.identifier('get'), j.identifier('get'))],
        j.literal('@ember/object')
      );
      const n = imports.length;

      if (n) {
        j(imports.at(n - 1).get()).insertAfter(s); // after the imports
      } else {
        root.get().node.program.body.unshift(s); // begining of file
      }
      return root;
    }
  }
  let sourceCode = j(file.source)
    .find(j.CallExpression)
    .replaceWith(convertToConditionalExpression)
    .toSource();
  let needsGetImport = false;

  j(sourceCode)
    .find(j.CallExpression)
    .forEach((p) => {
      if (p.value.callee.name === 'get') {
        needsGetImport = true;
      }
    });
  if (needsGetImport) {
    sourceCode = transformStandaloneGet(sourceCode).toSource();
  }

  return sourceCode;
};
