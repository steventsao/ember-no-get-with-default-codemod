import { get } from "@ember/object";
//TODO rewrite with `get(obj, 'key') ?? 'default'` if result can be null
const test = get(obj, 'key') !== undefined ? get(obj, 'key') : 'default';
//TODO rewrite with `get(obj, 'key') ?? 'default'` if result can be null
const test2 = (get(obj, 'key') !== undefined ? get(obj, 'key') : 'default').includes('blah');
