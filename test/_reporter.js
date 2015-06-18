"use strict";

var deep = require("getobject");

module.exports = function(done) {
    var results = {
            __start : Date.now(),
            __tests : 0,
            __pass  : 0,
            __fail  : 0
        },
                
        // State variables
        suite, result;
            
    return function(status, test, args) {
        // jshint maxcomplexity:13
        if(status === "finish") {
            return done(results);
        }

        switch(status) {
            case "start":
            case "suite-done":
            case "pass":
                // No-op
                break;

            case "suite":
                suite = {
                    __tests : 0,
                    __fail  : 0,
                    __pass  : 0
                };

                deep.set(results, args.length ? args.join(".") : "root", suite);
                break;
            
            case "test":
                result = true;
                results.__tests++;
                suite.__tests++;
                break;

            case "fail":
                result = false;
                suite[test.name] = args;
                break;

            case "test-done":
                results["__" + (result ? "pass" : "fail")]++;
                suite["__" + (result ? "pass" : "fail")]++;
                
                if(result) {
                    suite[test.name] = result;
                }

                break;
        }
    };
};
