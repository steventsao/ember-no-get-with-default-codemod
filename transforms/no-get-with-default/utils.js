// TODO add auto import `get`
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
