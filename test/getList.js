const resolver = require("..");
const html = require("fs").readFileSync(__dirname + "/test.html");

describe('test list', function () {

    it("get list", function (done) {

        const define = {
            "name": "item",
            "type": "item",
            "process": "processItem",
            "match": "/",
            "filter": "ul",
            "define":
                [{
                    "name": "list",
                    "match": "./",
                    "type": "list",
                    "filter": "li",
                    "process": "processList",
                    "define": [{
                        "name": "name",
                        "type": "text",
                        "process": "[COMMON_STR_PROCESS]",
                    }]
                }]
        };

        class Test {
            processItem(item) {
                console.log("item=====", JSON.stringify(item));
                return item;
            };
            processList(list) {
                console.log("list====", JSON.stringify(list));
                return list;
            }
        }

        let res = resolver(define, html, new Test());
        let str = '[{"name":"l1"},{"name":"l2"},{"name":"l3"},{"name":"l4"}]';
        if (res
            && res.item
            && res.item.list
            && res.item.list.length
            && JSON.stringify(res.item.list) === str) {
            done();
        } else {
            done(new Error(JSON.stringify(res) || "error"));
        }

    });

});