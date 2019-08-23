String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.replaceAll = function (s1, s2) {
    return this.split(s1).join(s2);
}
const cheerio = require("cheerio");

function ResolverCheerio(argObj) {

	/*
	argObj 对象属性
    define 配置信息
	objCurrent 为当前对象，为空时为document
	objRootCurrent 为当前解析根对象，
	objResult 收集结果
	cheerio 根对象
	*/

    let define = argObj.define,
        objRootCurrent = argObj.objRootCurrent,
        objCurrent = argObj.objCurrent,
        objResult = argObj.objResult || {},
        $ = argObj.cheerio;


    //首次调用 默认都为 $
    objRootCurrent = objRootCurrent || $;
    objCurrent = objCurrent || $;

    let objC;

    switch (define.match) {
        case '/': {
            objC = $;
            break;
        }
        case './': {
            objC = objRootCurrent;
            break;
        }
        default: {
            objC = objCurrent;
            break;
        }
    }

    switch (define.type) {
        case 'att': {//从当前对象属性中去查找
            if (define.filter) {

                if (objC.find) {
                    objCurrent = objC.find(define.filter);
                } else {
                    objCurrent = $(define.filter);
                }

            } else {
                objCurrent = objC;
            }

            if (objCurrent && objCurrent.attr(define.att)) {

                let value = objCurrent.attr(define.att);

                if (define.process) {
                    value = resolverCommonProcess(
                        define.process,
                        value,
                        define.process_param,
                        argObj.functions);
                }
                objResult[define.name] = value;
            }
            break;
        }
        case 'text': { //从内部文字中去查找
            if (define.filter) {

                if (objC.find) {
                    objCurrent = objC.find(define.filter);
                } else {
                    objCurrent = $(define.filter);
                }

            } else {
                objCurrent = objC;
            }

            if (objCurrent) {
                let value = null;

                if (objCurrent.get(0)
                    && objCurrent.get(0).tagName
                    && objCurrent.get(0).tagName.toLowerCase() == 'script') {
                    value = objCurrent.html();
                } else {
                    value = objCurrent.text();
                }

                if (define.process) {
                    value = resolverCommonProcess(define.process,
                        value,
                        define.process_param,
                        argObj.functions);
                }
                objResult[define.name] = value;
            }
            break;
        }
        case 'item': { //输出单个对象

            if (define.filter) {
                if (objCurrent.find) { // $ 没有find
                    objCurrent = objC.find(define.filter)
                } else {
                    objCurrent = $(define.filter)
                }
            } else {
                objCurrent = objC;
            }
            if (objCurrent) {
                let arg = {
                    define: {},
                    objRootCurrent: objCurrent,
                    objCurrent: objCurrent,
                    objResult: {},
                    functions: argObj.functions,
                    cheerio: $
                };
                for (let i = 0, len = define.define.length; i < len; i++) {
                    arg.define = define.define[i];
                    ResolverCheerio(arg);
                }
                objResult[define.name] = arg.objResult;
            }
            break;
        }
        case 'list': { //输出数组对象
            objResult[define.name] = [];

            if (define.filter) {
                if (objC.find) {
                    objCurrent = objC.find(define.filter);
                } else {
                    objCurrent = $(define.filter);
                }
            }

            for (let ni = 0; ni < objCurrent.length; ni++) {
                let objTmp = objCurrent.eq(ni);

                let arg = {
                    define: {},
                    objRootCurrent: objTmp,
                    objCurrent: objTmp,
                    objResult: {},
                    functions: argObj.functions,
                    cheerio: $
                }

                for (let i = 0, len = define.define.length; i < len; i++) {
                    arg.define = define.define[i];
                    ResolverCheerio(arg);
                }
                objResult[define.name].push(arg.objResult);
            }
            break;
        }
    }

    argObj.objResult = objResult;
    //如果是item或者list则需要处理最终处理函数
    if ((define.type == 'item' || define.type == 'list')
        && argObj.define.process
        && argObj.functions
        && argObj.functions[argObj.define.process]) {
        argObj.objResult = argObj.functions[argObj.define.process](objResult);
    }
}


function resolverCommonProcess(type, value, param, functions) {
    let result = null;
    let ni = 0, nj = 0;

    switch (type) {
        case '[TRIM_URL]': {//通用URL处理，删除?后的参数
            if ((ni = value.indexOf('?')) != -1)
                value = value.substring(0, ni).trim();
            result = value;
            break;
        }
        case '[REPLACE]': {
            if (!Array.isArray(param))
                param = [param];
            for (let n = 0; n < param.length; n++) {
                let p = param[n]
                if (p.f != null && p.t != null)
                    value = value.replace(p.f, p.t);
            }
            result = value.trim();
            break;
        }
        case '[COMMON_STR_PROCESS]': {//通用字符串处理，删除所有的空格和回车
            value = value.replaceAll(' ', '').replaceAll('\n', '').replaceAll('\r', '').trim();
            result = value;
            break;
        }
        default: {
            if (functions && functions[type]) {
                result = functions[type](value);
            }
        }
    }

    return result;
}

module.exports = function (define, html, funs) {
    if (!define) throw new Error("define is " + define);
    if (!html) throw new Error("define is " + html);
    let $ = cheerio.load(html);
    let arg = { define, cheerio: $, functions: funs };
    ResolverCheerio(arg);
    return arg.objResult;
};