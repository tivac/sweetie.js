"use strict";

var assert  = require("assert"),
    Sweetie = require("../sweetie");

describe("Sweetie", function() {
    describe("Suite Support", function() {
        it("should support adding a suite", function() {
            var s = new Sweetie();

            s.describe("one", function() {});

            assert.equal(typeof s.env.one, "object");
            assert(Array.isArray(s.env.one.__tests));
        });

        it("should support being called w/o a function", function() {
           var s = new Sweetie();

            s.describe("one");

            assert.equal(typeof s.env.one, "object");
            assert(Array.isArray(s.env.one.__tests));
        });

        it("should support adding a suite w/ a weird name", function() {
            var s = new Sweetie();

            s.describe("1/foo.ಠ_ಠ", function() {});

            assert.equal(typeof s.env["1/foo.ಠ_ಠ"], "object");
            assert(Array.isArray(s.env["1/foo.ಠ_ಠ"].__tests));
        });

        it("should support adding nested suites", function() {
            var s = new Sweetie();

            s.describe("one", function() {
                s.describe("two", function() {
                    s.describe("three");
                });

                s.describe("four", function() { });
            });

            assert.equal(typeof s.env.one, "object");
            assert(Array.isArray(s.env.one.__tests));

            assert.equal(typeof s.env.one.two, "object");
            assert(Array.isArray(s.env.one.two.__tests));

            assert.equal(typeof s.env.one.two.three, "object");
            assert(Array.isArray(s.env.one.two.three.__tests));

            assert.equal(typeof s.env.one.four, "object");
            assert(Array.isArray(s.env.one.four.__tests));
        });
    });
});
