import { get } from "@ember/object";
const test = get(obj, 'key') ?? 'default';
const test2 = (get(obj, 'key') ?? 'default').includes('blah');
