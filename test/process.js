const resolver = require("..");
const html = require("fs").readFileSync(__dirname + "/test.html");

describe('test get text', function () {

    it("get h1 text", function (done) {

        const define = {
            "name": "item",
            "type": "item",
            "process": "processItem",
            "match": "/",
            "filter": "div",
            "define":
                [{
                    "name": "name",
                    "type": "text",
                    "match": "./",
                    "process": "processTest",
                    "filter": "h1"
                }]
        };

        function Test() {
            this.processItem = function (item) {
                console.log("item======", JSON.stringify(item));
                return item;
            };
            this.processTest = function (text) {
                text = "processTest"
                return text;
            }
            return this;
        }

        let res = resolver(define, html, new Test());
        if (res && res.item && res.item.name === "processTest") {
            done();
        } else {
            done(new Error(JSON.stringify(res) || "error"));
        }
    });

});