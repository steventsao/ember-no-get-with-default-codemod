import { get } from 'ember/objects';

const test = get(this, "key") === undefined ? get(this, "key") : "default";
