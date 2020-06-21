const test = obj.getWithDefault('key', 'default');
const test2 = obj.getWithDefault('key', 'default').includes('blah');

const test3 = getWithDefault(this, "key", "default");
const test4 = getWithDefault(this, 'key', 'default').includes('blah');
const test5 = getWithDefault(obj, `foo.${key}`, []);