sweetie [![NPM Version](https://img.shields.io/npm/v/sweetie.svg)](https://www.npmjs.com/package/sweetie)[![NPM License](https://img.shields.io/npm/l/sweetie.svg)](https://www.npmjs.com/package/sweetie)
=======

<p align="center">
    <a href="https://www.npmjs.com/package/sweetie" alt="NPM Downloads">
        <img src="https://img.shields.io/npm/dm/sweetie.svg" />
    </a>
    <a href="https://travis-ci.org/tivac/sweetie.js" alt="Build Status">
        <img src="https://img.shields.io/travis/tivac/sweetie.js/master.svg" />
    </a>
    <a href="https://david-dm.org/tivac/sweetie.js" alt="Dependency Status">
        <img src="https://img.shields.io/david/tivac/sweetie.js.svg" />
    </a>
    <a href="https://david-dm.org/tivac/sweetie.js#info=devDependencies" alt="devDependency Status">
        <img src="https://img.shields.io/david/dev/tivac/sweetie.js.svg" />
    </a>
</p>

Sweetie is a BDD test runner, inspired by Mocha but written to be as simple as possible. It doesn't have any fancy reporters, it doesn't support 95% of what Mocha does, it just sets up a series of tests & suites and runs them.

It's probably not something you want but it's well-tested and simple to hack on!

## Example

```js
var Sweetie = require("sweetie"),
    tests   = new Sweetie();

// Add a test
tests.it("Test Name", function() {
    ...
});

// Add a suite
tests.describe("Test Suite", fucntion() {
    tests.it("test inside a suite", function() {
        ...
    });
});

// Add an async test
tests.it("Async Test", function(done) {
    ...
    done();
});

// Run the tests and provide a reporter callback function
tests.run(function(state) {
    
    ...
});
```

