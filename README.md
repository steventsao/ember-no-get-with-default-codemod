# ember-no-get-with-default-codemod


A collection of codemod's for ember-no-get-with-default-codemod.

## Usage

To run a specific codemod from this project, you would run the following:

```
npx ember-no-get-with-default-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add ember-no-get-with-default-codemod
ember-no-get-with-default-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
Before
```js
const test = obj.getWithDefault('key', 'default');
const test2 = obj.getWithDefault('key', 'default').includes('foo');
```

After
```js
const test = get(obj, 'key') !== undefined ? get(obj, 'key') : 'default';
const test2 = (get(obj, 'key') !== undefined ? get(obj, 'key') : 'default').includes('foo');
```
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`

### Debugging

* `node --inspect-brk ./node_modules/.bin/jest --runInBand`

### Limitation
- [ ] Does not add import 'get' when it's missing

### References
* [no-get-with-default RFC](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-get-with-default.md)
* [debugging](https://github.com/rajasegar/ember-angle-brackets-codemod#debugging-workflow)