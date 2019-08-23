const resolver = require("..");
const html = require("fs").readFileSync(__dirname + "/test.html");

describe('test get script', function () {

    it("get script", function (done) {

        const define = {
            "name": "item",
            "type": "item",
            "process": "processItem",
            "match": "/",
            "filter": "html",
            "define":
                [{
                    "name": "name",
                    "type": "text",
                    "match": "./",
                    "process": "processScript",
                    "filter": "script"
                }]
        };

        function Test() {
            this.processItem = function (item) {
                console.log("item======", JSON.stringify(item));
                return item;
            };
            this.processScript = function (name) {
                let script = new Function(name + ";return test");
                name = script()()
                return name;
            }
            return this;
        }

        let res = resolver(define, html, new Test());
        if (res && res.item && res.item.name) {
            console.log(typeof res.item.name == "tseian.com")
            done();
        } else {
            done(new Error(JSON.stringify(res) || "error"));
        }
    });

});