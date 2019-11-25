const resolver = require("..");
const html = require("fs").readFileSync(__dirname + "/test.html");

describe('test list', function () {

    it("get list", function (done) {

        const define = {
            "name": "item",
            "type": "item",
            "process": "processItem",
            "match": "/",
            "filter": "div.divClass",
            "define":
                [{
                    "name": "html",
                    "match": "./",
                    "type": "html",
                    "filter": "ul",
                    "process": "[COMMON_STR_PROCESS]"
                }]
        };

        class Test {
            processItem(item) {
                console.log("item=====", JSON.stringify(item));
                return item;
            };
            processHtml(html) {
                console.log("html====", html);
                return html;
            }
        }

        let res = resolver(define, html, new Test());
        if (res
            && res.item
            && res.item.html
            && res.item.html.length) {
            console.log("ul html====", res.item.html)
            done();
        } else {
            done(new Error(JSON.stringify(res) || "error"));
        }

    });

});