import { getWithDefault } from '@ember/object';

const test = getWithDefault(obj, 'key', 'default');
const test2 = getWithDefault(obj, 'key', 'default').includes('blah');
