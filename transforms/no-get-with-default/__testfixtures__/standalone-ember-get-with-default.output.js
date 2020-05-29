const test = get(this, "key") !== undefined ? get(this, "key") : "default";
const test2 = (get(this, 'key') !== undefined ? get(this, 'key') : 'default').includes('blah');
const test3 = get(obj, `foo.${key}`) !== undefined ? get(obj, `foo.${key}`) : [];