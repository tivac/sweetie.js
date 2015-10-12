"use strict";

var assert = require("assert"),
    
    Sweetie = require("../sweetie"),
    
    reporter = require("./_reporter"),
    state    = require("./_state");

describe("Sweetie", function() {
    describe(".run()", function() {
        it("should set the reporter value", function() {
            var s = new Sweetie(),
                r = function() {};

            s.run(r);

            assert.equal(s.reporter, r);
        });

        it("should support no runner", function() {
            var s = new Sweetie();

            assert.doesNotThrow(function() {
                s.run();
            });
        });

        it("should clean up the environment before running", function() {
            var s = new Sweetie();

            // One test needs to have a function body to ensure we don't double-process
            // tests
            s.it("test", function() { });
            
            s.it("test2");

            s.run(function(state) {
                if(state !== "start") {
                    return;
                }

                assert.equal(s._tests.length, 2);
            });

            s.run(function(state) {
                if(state !== "prep") {
                    return;
                }

                assert(Array.isArray(s._tests));
                assert.equal(s._tests.length, 0);

                assert.equal(s.suite, undefined);
            });
        });

        it("should report a \"prep\" event", function() {
            var s = new Sweetie();

            s.run(state("prep", assert));
        });

        it("should report a \"start\" event", function() {
            var s = new Sweetie();

            s.run(state("start", assert));
        });

        it("should report a \"fail\" event", function() {

        });

        it("should report a \"finish\" event", function() {
            var s = new Sweetie();

            s.run(state("finish", assert));
        });

        it("should report a \"skipped\" event", function() {
            var s = new Sweetie();

            s.it("one");

            s.filter("two");

            s.run(state("skipped", assert));
        });

        it("should report a \"suite\" event", function() {
            var s = new Sweetie();

            s.describe("suite", function() {
                s.it("test");
            });

            s.run(state("suite", assert));
        });

        it("should report a \"suite-done\" event", function() {
            var s = new Sweetie();

            s.describe("suite", function() {
                s.it("test");
            });

            s.run(state("suite-done", assert));
        });

        it("should report a \"empty\" event", function() {
            var s = new Sweetie();

            s.it("one");

            s.run(state("empty", assert));
        });

        it("should report a \"test\" event", function() {
            var s = new Sweetie();

            s.it("one", function() { });

            s.run(state("test", assert));
        });

        it("should structure tests in order", function() {
            var s = new Sweetie();

            s.it("one");
            s.it("two");
            s.it("three");

            s.run(function(state, test, args) {
                if(state !== "start") {
                    return;
                }

                assert.deepEqual(args, [
                    { name : "one", fn : false, async : false, suite : [] },
                    { name : "two", fn : false, async : false, suite : [] },
                    { name : "three", fn : false, async : false, suite : [] }
                ]);
            });
        });

        it("should structure suites and tests in order", function() {
            var s = new Sweetie();

            s.it("t-root");

            s.describe("s-1", function() {
                s.it("t-1");

                s.describe("s-2", function() {
                    s.it("t-2");
                    s.it("t-2-2");
                });

                s.it("t-1-2");
            });

            s.describe("s-3", function() {
                s.it("t-3");
            });

            s.describe("s-1", function() {
                s.it("t-1-3");

                s.describe("s-4", function() {
                    s.it("t-4");
                });
            });

            s.run(function(state, test, args) {
                if(state !== "start") {
                    return;
                }

                assert.deepEqual(args, [
                    { name : "t-root", fn : false, async : false, suite : [] },
                    { name : "t-1", fn : false, async : false, suite : [ "s-1" ] },
                    { name : "t-1-2", fn : false, async : false, suite : [ "s-1" ] },
                    { name : "t-1-3", fn : false, async : false, suite : [ "s-1" ] },
                    { name : "t-2", fn : false, async : false, suite : [ "s-1", "s-2" ] },
                    { name : "t-2-2", fn : false, async : false, suite : [ "s-1", "s-2" ] },
                    { name : "t-4", fn : false, async : false, suite : [ "s-1", "s-4" ] },
                    { name : "t-3", fn : false, async : false, suite : [ "s-3" ]
                }]);
            });
        });

        it("should recognize async tests", function() {
            var s = new Sweetie();

            s.it("one", function(done) {
                done();
            });

            s.run(function(state, test, args) {
                if(state !== "start") {
                    return;
                }

                // Can't use deepEqual here because the test fn gets rewritenn
                assert.equal(args[0].name, "one");
                assert.equal(args[0].async, true);
                assert.equal(typeof args[0].fn, "function");
                
                // this seems silly but .equal doesn't handle arrays
                assert.deepEqual(args[0].suite, []);
            });
        });

        it("should run actual tests", function() {
            var s = new Sweetie(),
                one, two;

            s.it("1", function() {
                one = true;
            });

            s.it("2", function() {
                two = true;
            });

            s.run(function(state, test, args) {
                if(state !== "finish") {
                    return;
                }

                assert(one && two);
            });
        });

        it("should fail tests that assert", function() {
            var s = new Sweetie();

            s.it("one", function() {
                throw new Error();
            });

            s.run(reporter(function(results) {
                assert.equal(results.__fail, 1);

                // Can't use .deepEqual here because the error gets munged
                assert.equal(results.root.__fail, 1);
                assert(results.root.one instanceof Error);
            }));
        });

        it("should run asynchronous tests", function(done) {
            var s = new Sweetie(),
                o = [];

            s.it("one", function(cb) {
                o.push("one");

                cb();
            });

            s.it("two", function(cb) {
                o.push("two");

                cb();
            });

            s.run(reporter(function() {
                assert.deepEqual(o, [
                    "one",
                    "two"
                ]);

                done();
            }));
        });

        it("should fail async tests that assert", function(done) {
            var s = new Sweetie(),
                o = [];

            s.it("one", function(cb) {
                o.push("1");

                throw new Error();

                o.push("1-2");

                cb();
            });

            s.it("two", function() {
                o.push("2");
            });

            s.run(reporter(function(results) {
                assert.deepEqual(o, [ "1", "2" ]);

                done();
            }));
        });

        it("should only run tests matching the filter (if specified)", function() {
            var s = new Sweetie(),
                o = [];

            s.it("foo", function() {
                o.push("foo");
            });

            s.it("bar", function() {
                o.push("bar");
            });

            s.filter("foo");

            s.run(reporter(function(results) {
                assert.deepEqual(o, [ "foo" ]);
            }));
        });
    });
});
