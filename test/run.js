"use strict";

var assert  = require("assert"),
    Sweetie = require("../sweetie");

describe("Sweetie", function() {
    describe(".run()", function() {
        it("should add a test to the current context", function() {
            var s = new Sweetie();

            s.it("one", function() {});

            assert.equal(s.context.__tests.length, 1);
        });

        it("should add a test to the current context when nested", function() {
            var s = new Sweetie();

            s.describe("one", function() {
                s.it("one", function() {});

                s.describe("two", function() {
                    s.it("two");
                });
            });

            assert.equal(s.env.one.__tests.length, 1);
            assert.equal(s.env.one.two.__tests.length, 1);
        });
    });
});
