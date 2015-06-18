"use strict";

var assert  = require("assert"),
    Sweetie = require("../sweetie"),
    reporter = require("./_reporter");

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

            s.it("test");
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

                assert.equal(s._tests.length, 0);
                assert.equal(s.suite, null);
            });
        });

        it("should report a \"prep\" event", function() {
            var s = new Sweetie(),
                e;

            s.run(function(state) {
                if(e || state !== "prep") {
                    return;
                }

                e = true;
            });

            assert(e);
        });

        it("should report a \"start\" event", function() {
            var s = new Sweetie(),
                e;

            s.run(function(state) {
                if(e || state !== "start") {
                    return;
                }

                e = true;
            });

            assert(e);
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

                assert.deepEqual(args, [{
                    name : "one", suite : []
                },{
                    name : "two", suite : []
                },{
                    name : "three", suite : []
                }]);
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

                assert.deepEqual(args, [{
                    name : "t-root", suite : []
                },{
                    name : "t-1", suite : [ "s-1" ]
                },{
                    name : "t-1-2", suite : [ "s-1" ]
                },{
                    name : "t-1-3", suite : [ "s-1" ]
                },{
                    name : "t-2", suite : [ "s-1", "s-2" ]
                },{
                    name : "t-2-2", suite : [ "s-1", "s-2" ]
                },{
                    name : "t-4", suite : [ "s-1", "s-4" ]
                },{
                    name : "t-3", suite : [ "s-3" ]
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
    });
});
