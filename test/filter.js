"use strict";

var assert  = require("assert"),
    Sweetie = require("../sweetie");

describe("Sweetie", function() {
    describe(".filter()", function() {
        it("should be a function", function() {
            var s = new Sweetie();

            assert.equal(typeof s.filter, "function");
        });

        it("should set the _filter property to a RegExp", function() {
            var s = new Sweetie();

            s.filter("asdf");

            assert(s._filter instanceof RegExp);
            assert.equal(s._filter.toString(), "/asdf/i");
        });

        it("should clear the _filter property if called w/o arguments", function() {
            var s = new Sweetie();

            s.filter("asdf");

            assert(s._filter instanceof RegExp);

            s.filter();

            assert.equal(s._filter, false);
        });
    });
});
