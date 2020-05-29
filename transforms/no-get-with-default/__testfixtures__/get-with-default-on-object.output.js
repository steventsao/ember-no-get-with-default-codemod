const test = get(obj, 'key') !== undefined ? get(obj, 'key') : 'default';
const test2 = (get(obj, 'key') !== undefined ? get(obj, 'key') : 'default').includes('blah');
