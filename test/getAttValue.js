const resolver = require("..");
const html = require("fs").readFileSync(__dirname + "/test.html");

describe('test get att value', function () {

    it("get class", function (done) {

        const define = {
            "name": "item",
            "type": "item",
            "process": "processItem",
            "match": "/",
            "filter": "div",
            "define":
                [{
                    "name": "name",
                    "type": "att",
                    "att": "class",
                    "match": "./",
                    "process": "[COMMON_STR_PROCESS]",
                    "filter": "h1"
                }]
        };

        function Test() {
            this.processItem = function (item) {
                console.log("item=====", JSON.stringify(item));
                return item;
            };
            return this;
        }

        let res = resolver(define, html, new Test());
        if (res && res.item && res.item.name === "h1Class") {
            done();
        } else {
            done(new Error(JSON.stringify(res) || "error"));
        }
    });

    it("get value", function (done) {

        const define = {
            "name": "item",
            "type": "item",
            "process": "processItem",
            "match": "/",
            "filter": "div",
            "define":
                [{
                    "name": "name",
                    "type": "att",
                    "att": "value",
                    "match": "./",
                    "process": "[COMMON_STR_PROCESS]",
                    "filter": "input"
                }]
        };

        function Test() {
            this.processItem = function (item) {
                console.log("item=======", JSON.stringify(item));
                return item;
            };
        }

        let res = resolver(define, html, new Test());
        if (res && res.item && res.item.name === "inputValue") {
            done();
        } else {
            done(new Error(JSON.stringify(res) || "error"));
        }

    });
});