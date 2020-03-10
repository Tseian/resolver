const resolver = require("..");
const cheerio = require("cheerio");
const html = require("fs").readFileSync(__dirname + "/test.html");

describe('test get att value', function () {

    it("process element", function (done) {

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
                    "process": "processAttName",
                    "filter": "input"
                }]
        };

        function Test() {
            this.processItem = function (item, element) {
                console.log("item=======", JSON.stringify(item));
                return item;
            };
            this.processAttName = function (attName, element) {
                console.log("attName=======", JSON.stringify(attName));
                console.log("element===class===inputValueClass===", element.attr('class'))
                return attName;
            }
        }

        let res = resolver(define, html, new Test());
        if (res && res.item && res.item.name === "inputValue") {
            done();
        } else {
            done(new Error(JSON.stringify(res) || "error"));
        }

    });


    it("get list and process", function (done) {

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
            processList(list, element) {
                console.log("list====", JSON.stringify(list));
                console.log('li=element=array[0].name===', element[0].name)
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