"use strict";

var assert  = require("assert"),
    Sweetie = require("../sweetie");

describe("Sweetie", function() {
    describe(".it()", function() {
        it("should add a test to the current context", function() {
            var s = new Sweetie();

            s.it("one", function() {});

            assert.equal(s.context.__tests.length, 1);
        });

        it("should add a test to the current context when nested", function() {
            var s = new Sweetie(),
                t = function() {};

            s.describe("one", function() {
                s.it("one", t);

                s.describe("two", function() {
                    s.it("two");
                });
            });

            assert.deepEqual(s.env, {
                __tests : [],
                one : {
                    __tests : [{
                        fn : t,
                        name : "one"
                    }],
                    two : {
                        __tests : [{
                            fn : undefined,
                            name : "two"
                        }]
                    }
                }
            });
        });
    });
});
