const test = getWithDefault(this, "key", "default");
const test2 = getWithDefault(this, 'key', 'default').includes('blah');
const test3 = getWithDefault(obj, `foo.${key}`, []);