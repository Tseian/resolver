# c-resolver  a  tool for crawler
## Installation
```shell
npm install c-resolver
```
## example 

### get something you need from [test.html](https://github.com/Tseian/resolver/blob/master/test/test.html)
```html
<html>
<head>
    <script type="text/javascript">
        let test = function () {
            return "tseian.com";
        }
    </script>
</head>
<body>
    <div class="divClass">
        <h1 class="h1Class">h1Text</h1>
        <input value="inputValue" />
        <ul class="ulClass">
            <li>l1</li>
            <li>l2</li>
            <li>l3</li>
            <li>l4</li>
        </ul>
    </div>
</body>
</html>
```

- get attribute value 
  - get class name from h1
    ```js
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
            this.processItem = function (item,element) { //handle item befor output
                return item;
            };
            return this;
        }
        let res = resolver(define, html, new Test());
        /**
         * res = {item:{name:"h1Class"}}
         * /


    ```
    - get a list from ul->li
      ```js
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
            processItem(item,element) {
                return item;
            };
            processList(list,elements) {
                return list;
            }
        }

        let res = resolver(define, html, new Test());
        /**
         * res = {item:[{"name":"l1"},{"name":"l2"},{"name":"l3"},{"name":"l4"}]}
         * /
      ```
-there are more [example](https://github.com/Tseian/resolver/tree/master/test)
## how define define&process

- "name": "key",  //outut obejct key
- "type": "valueType", //value type: 
    - item: output value is a object,
    - lis: output value is a array(collection) 
    - text: output value is a string 
    - att: output value is a  string(if type is att, should define att value )
- "att": "attName",  //element attribute name
- "process": "processItem", //a function excute before output with param 
- "match": "/", // cheerio will find element by selector(filter) in the following element object 
    - '/' is root element obejct from cheerio.load(root element html)  
    - "./" is father element object   
- "filter": "div", // element selector

## process 
must be a function and return output value you want