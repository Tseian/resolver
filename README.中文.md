# c-resolver  一个爬虫小工具
## example 

### 从测试html中获取想要的信息[test.html](https://github.com/Tseian/resolver/blob/master/test/test.html)
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

- 获取标签属性值
  - 从h1中获取class属性值
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
            this.processItem = function (item) {  
                return item;
            };
            return this;
        }
        let res = resolver(define, html, new Test());
        /**
         * res = {item:{name:"h1Class"}}
         * /


    ```
    - 获取得到一个列表数据从 ul -> li 这个标签
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
            processItem(item) {
                return item;
            };
            processList(list) {
                return list;
            }
        }

        let res = resolver(define, html, new Test());
        /**
         * res = {item:[{"name":"l1"},{"name":"l2"},{"name":"l3"},{"name":"l4"}]}
         * /
      ```
-there are more [example](https://github.com/Tseian/resolver/tree/master/test)
## 怎么定义 define和process

- "name": "key",  //输出值时 值对应的key
- "type": "valueType", //输出key对应的数据类型: 
    - item: 输出数据一个object,
    - lis: 输出数据是一个数组 
    - text: 输出数据是一个字符串 
    - att:  输出数据是一个字符串，但att一定要设置有值，表示获取某一个标签的属性值
- "att": "attName",  //标签属性值
- "process": "processItem", // 对输出数据进行处理
- "match": "/",  指定程序在哪一个父元素下面找元素
    - '/' 表示根元素 document  
    - "./" 表示父元素 
- "filter": "div", // element selector

## process 
设置一个函数，对程序查找后的值进行处理