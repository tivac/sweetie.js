"use strict";

module.exports = function(check, fn) {
    var e;

    return function(state) {
        var done = state === "finish";

        if(e || state !== check) {
            return done ? fn(e) : false;
        }

        e = true;

        if(done) {
            fn(e);
        }
    };
};
