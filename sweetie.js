(function(global) {
"use strict";

var Sweetie;

Sweetie = function() {
    this.env = {
        __tests : []
    };
    
    this.context = this.env;
};

Sweetie.globalize = function() {
    var sweetie = new Sweetie();

    [ "it", "describe", "ok" ].forEach(function(prop) {
        global[prop] = sweetie[prop].bind(sweetie);
    });

    return sweetie;
};

Sweetie.prototype = {
    describe : function(name, fn) {
        var old;

        if(!this.context[name]) {
            this.context[name] = {
                __tests  : []
            };
        }

        old          = this.context;
        this.context = this.context[name];

        if(typeof fn === "function") {
            fn();
        }

        this.context = old;
    },
    
    it : function(name, fn) {
        this.context.__tests.push({ name : name, fn : fn });
    },
    
    ok : function(cond, msg) {
        this.reporter(!!cond ? "pass" : "fail", this.test, {
            condition : cond,
            message   : msg || "",
            stack     : (new Error()).stack
        });
    },
    
    _collectTests : function (chain, tests) {
        if(!tests.length) {
            return;
        }
        
        var self = this;
        
        // Rewrite bare test function into something a little nicer
        this._tests = this._tests.concat(tests.map(function(src) {
            var test = {};

            test.name  = src.name;
            test.suite = chain;

            if(!src.fn) {
                return test;
            }

            test.async = !!src.fn.length;

            test.fn = function(next) {
                self.reporter("test", test);
                self.test = test;
                
                // Doesn't handle async exceptions, but we're ok w/ that
                try {
                    src.fn(next);
                } catch(e) {
                    self.reporter("fail", test, e);
                    
                    if(typeof next === "function") {
                        next();
                    }
                }
            };

            return test;
        }));
    },

    _collectSuite : function (chain, suite) {
        var self = this;
    
        this._collectTests(chain, suite.__tests);

        Object.keys(suite).forEach(function(name) {
            if(name === "__tests") {
                return;
            }

            self._collectSuite(chain.concat(name), suite[name]);
        });
    },

    _next : function () {
        var self = this,
            test = this._tests.shift();

        if(!test) {
            if(this.suite) {
                this.reporter("suite-done", null, this.suite);
            }

            return this.reporter("finish");
        }
        
        if(test.suite !== this.suite) {
            if(this.suite) {
                this.reporter("suite-done", null, this.suite);
            }
            
            this.reporter("suite", null, test.suite);
            
            this.suite = test.suite;
        }
        
        if(!test.fn) {
            this.reporter("empty", test);
            return this._next();
        }

        if(test.async) {
            return test.fn(function() {
                self.reporter("test-done", test);
                self._next.call(self);
            });
        }

        test.fn();
        
        this.reporter("test-done", test);
        this._next();
    },

    run : function(reporter) {
        this._tests = [];
        this.suite  = null;
        
        this.reporter = (typeof reporter === "function") ? reporter : function() {};

        this.reporter("prep", null, this.env);

        this._collectSuite([], this.env);
        
        this.reporter("start", null, this._tests);
        
        this._next();
    }
};

if(typeof module !== "undefined" && module.exports) {
    module.exports = Sweetie;
} else {
    global.Sweetie = Sweetie;
}

}((function() { return this; }())));
