"use strict";

var assert  = require("assert"),
    Sweetie = require("../sweetie");

describe("Sweetie", function() {
    it("should be a function", function() {
        assert.equal(typeof Sweetie, "function");
    });

    it("should offer a .globalize() function", function() {
        assert.equal(typeof Sweetie.globalize, "function");
    });

    it("should initialize itself on construction", function() {
        var s = new Sweetie();

        assert.equal(typeof s, "object");
        assert.equal(typeof s.env, "object");
        assert.equal(s.env, s.context);
    });
});
