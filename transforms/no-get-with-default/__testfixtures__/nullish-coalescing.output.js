import { get } from "@ember/object";
const test = get(obj, 'key') ?? 'default';
const test2 = (get(obj, 'key') ?? 'default').includes('blah');

const test3 = get(this, "key") ?? "default";
const test4 = (get(this, 'key') ?? 'default').includes('blah');
const test5 = get(obj, `foo.${key}`) ?? [];
