function getDynamicComment(code) {
  return ` TODO rewrite with \`${code}\` if result can be null`;
}

function getTopLevelNodePath(path, lastPath) {
  lastPath = lastPath || path;

  if (path.name === 'body') {
    return lastPath;
  }
  return getTopLevelNodePath(path.parentPath, path);
}

function transformGetWithDefaultOnMemberExpression(path, j, options) {
  const [key, value] = path.value.arguments;
  const obj = path.value.callee.object;

  if (options.commentNullishCoalescing) {
    const codeSource = j(
      j.logicalExpression('??', j.callExpression(j.identifier('get'), [obj, key]), value)
    ).toSource();
    const comment = j.commentLine(getDynamicComment(codeSource), true, false);
    const topLevelNodePath = getTopLevelNodePath(path);

    if (topLevelNodePath.node.comments && topLevelNodePath.node.comments.length) {
      topLevelNodePath.node.comments = [...topLevelNodePath.node.comments, comment];
    } else {
      topLevelNodePath.node.comments = [comment];
    }
  }
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
function transformStandAloneEmberGetWithDefault(path, j, options) {
  const [obj, key, value] = path.value.arguments;

  if (options.commentNullishCoalescing) {
    const codeSource = j(
      j.logicalExpression('??', j.callExpression(j.identifier('get'), [obj, key]), value)
    ).toSource();
    const comment = j.commentLine(getDynamicComment(codeSource), true, false);
    const topLevelNodePath = getTopLevelNodePath(path);

    if (topLevelNodePath.node.comments && topLevelNodePath.node.comments.length) {
      topLevelNodePath.node.comments = [...topLevelNodePath.node.comments, comment];
    } else {
      topLevelNodePath.node.comments = [comment];
    }
  }

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

module.exports = {
  getTopLevelNodePath,
  transformStandAloneEmberGetWithDefault,
  transformGetWithDefaultOnMemberExpression,
};
