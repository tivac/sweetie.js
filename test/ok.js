"use strict";

var assert  = require("assert"),
    Sweetie = require("../sweetie");

describe("Sweetie", function() {
    describe(".ok()", function() {
        it("should be a function", function() {
            var s = new Sweetie();

            assert.equal(typeof s.ok, "function");
        });

        it("should call the reporter with a result", function() {
            var s = new Sweetie();

            s.reporter = function(state, test, args) {
                assert.equal(state, "pass");
            };

            s.ok(true);

            s.reporter = function(state, test, args) {
                assert.equal(state, "fail");
            };

            s.ok(false);
        });

        it("should treat the first argument as a boolean", function() {
            var s = new Sweetie();

            s.reporter = function(state, test, args) {
                assert.equal(state, "pass");
            };

            s.ok("hello");
            s.ok(1);
            s.ok(-1);
            s.ok([]);
            s.ok([ 1 ]);
            s.ok({});

            s.reporter = function(state, test, args) {
                assert.equal(state, "fail");
            };

            s.ok("");
            s.ok(0);
            s.ok(undefined);
            s.ok(NaN);
            s.ok(null);
        });

        it("should accept a message param", function() {
            var s = new Sweetie();

            s.reporter = function(state, test, args) {
                assert.equal(args.message, "test");
            };

            s.ok(true, "test");
            s.ok(false, "test");
            s.ok(1 === 1, "test");
        });

        it("should pass along the current test", function() {
            var s = new Sweetie(),
                t = { };

            s.reporter = function(state, test, args) {
                assert.equal(test, t);
            };

            s.test = t;

            s.ok(true);
        });
    });
});
