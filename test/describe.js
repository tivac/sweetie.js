"use strict";

var assert  = require("assert"),
    Sweetie = require("../sweetie");

describe("Sweetie", function() {
    describe(".describe() basics", function() {
        it("should support adding a suite", function() {
            var s = new Sweetie();

            s.describe("one", function() {});

            assert.deepEqual(s.env, {
                __tests : [],
                one : {
                    __tests : []
                }
            });
        });

        it("should support being called w/o a function", function() {
           var s = new Sweetie();

            s.describe("one");

            assert.deepEqual(s.env, {
                __tests : [],
                one : {
                    __tests : []
                }
            });
        });

        it("should support adding a suite w/ a weird name", function() {
            var s = new Sweetie();

            s.describe("1/foo.ಠ_ಠ", function() {});

            assert.deepEqual(s.env, {
                __tests : [],
                "1/foo.ಠ_ಠ" : {
                    __tests : []
                }
            });
        });

        it("should support multiple calls to the same suite", function() {
            var s = new Sweetie();

            s.describe("one");
            s.describe("one");
            s.describe("one");

            assert.deepEqual(s.env, {
                __tests : [],
                one : {
                    __tests : []
                }
            });
        });

        it("should support adding nested suites", function() {
            var s = new Sweetie();

            s.describe("one", function() {
                s.describe("two", function() {
                    s.describe("three");
                });

                s.describe("four", function() { });
            });

            assert.deepEqual(s.env, {
                __tests : [],
                one : {
                    __tests : [],
                    two : {
                        __tests : [],
                        three : {
                            __tests : []
                        }
                    },
                    four : {
                        __tests : []
                    }
                }
            });
        });
    });

    describe(".describe() & .it()", function() {
        var test = function() {};

        it("should put tests into the correct suite", function() {
            var s = new Sweetie();

            s.it("root");

            s.describe("one", function() {
                s.it("one");

                s.describe("two", function() {
                    s.it("two");

                    s.describe("three");

                    s.it("two2");
                });

                s.describe("four", function() {
                    s.describe("five", function() {
                        s.it("five");
                    });
                });
            });

            assert.deepEqual(s.env, {
                __tests : [{
                    fn : undefined,
                    name : "root"
                }],
                one : {
                    __tests : [{
                        name : "one",
                        fn : undefined
                    }],
                    two : {
                        __tests : [{
                            name : "two",
                            fn : undefined
                        }, {
                            name : "two2",
                            fn : undefined
                        }],
                        three : {
                            __tests : []
                        }
                    },
                    four : {
                        __tests : [],
                        five : {
                            __tests : [{
                                name : "five",
                                fn : undefined
                            }]
                        }
                    }
                }
            });
        });

        it("should put tests into the correct suite on repeated calls", function() {
            var s = new Sweetie();

            s.describe("one", function() {
                s.it("one");
            });

            s.describe("one", function() {
                s.it("one2");
            });

            s.describe("one", function() {
                s.describe("two", function() {
                    s.it("two");
                });
            });

            s.describe("one", function() {
                s.describe("two", function() {
                    s.it("two2");
                });
            });

            assert.deepEqual(s.env, {
                __tests : [],
                one : {
                    __tests : [{
                        name : "one", fn : undefined
                    }, {
                        name : "one2", fn : undefined
                    }],
                    two : {
                        __tests : [{
                            name : "two", fn : undefined
                        }, {
                            name : "two2", fn : undefined
                        }]
                    }
                }
            });
        });
    });
});
