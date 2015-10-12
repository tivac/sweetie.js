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
            var s  = new Sweetie(),
                t  = function() {},
                t2 = function(done) {};

            s.describe("one", function() {
                s.it("one", t);

                s.describe("two", function() {
                    s.it("two");
                    s.it("three", t2);
                });
            });

            assert.deepEqual(s.env, {
                __tests : [],
                one : {
                    __tests : [
                        { name : "one", fn : t, async : false}
                    ],
                    two : {
                        __tests : [
                            { name : "two", fn : false, async : false },
                            { name : "three", fn : t2, async : true }
                        ]
                    }
                }
            });
        });
    });
});
