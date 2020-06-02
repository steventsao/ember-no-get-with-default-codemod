import { get } from "@ember/object";
const test = get(this, "key") !== undefined ? get(this, "key") : "default";
const test2 = (get(this, 'key') !== undefined ? get(this, 'key') : 'default').includes('blah');
