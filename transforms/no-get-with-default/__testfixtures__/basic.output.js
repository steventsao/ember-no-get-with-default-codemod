import { get } from "@ember/object";
const test = get(this, "key") === undefined ? get(this, "key") : "default";
