const https = require("https");
const http = require('http');
const qs = require("querystring");
const URL = require('url');

const getRequestMethodAndFormOption = function (url,option,method) {
    let surl = url.split('/').filter(_ => _);
    let reqType = 'http';
    if (surl[0] === 'http:') {} else if (surl[0] === 'https:') {
        reqType = 'https';
    }
    let reqMethod;
    if (reqType === 'http') {
        reqMethod = http.request.bind(http);
    } else {
        reqMethod = https.request.bind(https);
    }


    let link = URL.parse(url);
    let opt = {
        hostname: link.hostname,
        path: link.path,
        method: (method || 'post'),
        port: link.port,
        ...(option || {})
    };
    return {
        reqMethod,
        opt
    };
};

/**
 * @return Promise
 * */
const get = function(url,option) {
    option = option || {};
    const httpGet = http.get.bind(http);
    const httpsGet = https.get.bind(https);
    let getMethod = (function (url) {
        if (url.startsWith('http://')) {
            return httpGet;
        } else if (url.startsWith('https://')) {
            return httpsGet;
        }
    })(url);
    return new Promise(function (scb,fcb) {
        getMethod(url,option,(resp) => {
            let data = '';
            resp.on('data',(chunk) => data += chunk);
            resp.on('end',() => {
                scb(data);
            });
            resp.on("error",fcb);
        });
    })
};
const getAdv = function (url,option,setReq) {
    setReq = setReq || (() => {});
    let {
        reqMethod,
        opt
    } = getRequestMethodAndFormOption(url,option,'get');
    return new Promise(function (s,f) {
        let req = reqMethod(opt,function (res) {
            let datas = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                datas += chunk;
            });
            res.on('end',function () {
                s({data: datas,req,res});
            });
            res.on('error',function (err) {
                f(err);
            });
        });
        setReq(req);
        req.end();
        req.on('error',f);
    });
};

/**
 * @return Promise
 * */
const post = function (url,option,data) {
    let {
        reqMethod,
        opt
    } = getRequestMethodAndFormOption(url,option);
    return new Promise(function (s,f) {
        let req = reqMethod(opt,function (res) {
            let datas = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                datas += chunk;
            });
            res.on('end',function () {
                s(datas);
            });
            res.on('error',function (err) {
                f(err);
            });
        });
        if (data) {
            let reqStr = qs.stringify(data);
            opt.headers = {
                ...(opt.headers || {}),
                'Content-Length': Buffer.byteLength(reqStr)
            };
            req.write(reqStr);
        }
        req.end();
        req.on('error',f);
    });
};

const defaultHeader = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};

function DownloadFile(filePath,url,cb) {
    console.log(`to download file >>> ${filePath}`);
    let {
        reqMethod
    } = getRequestMethodAndFormOption(url,{},'get');
    const downFile = (url) => {
        return new Promise(function (succ,fail) {
            reqMethod(url,(resp) => {
                let data = [];
                resp.on('data',(chunk) => {
                    data.push(chunk);
                });
                resp.on('end',() => {
                    succ(data);
                });
                resp.on("error",err => {
                    fail(err);
                });
            });
        });
    };
    downFile(url)
        .then(data => {
            let ws = fs.createWriteStream(filePath);
            data.forEach(ws.write.bind(ws));
            ws.end();
        })
        .then(cb);
}

const repFn = {
    "/2%2f"(str) {
        return str.replace(/\//g,'%2F');
    },
    "+2%2b"(str) {
        return str.replace(/\+/g,'%2B');
    },
    "=2%3d"(str) {
        return str.replace(/=/g,'%3D');
    }
};
const getString = function(obj,rep) {
    rep = rep || (a => a);
    let str = [];
    for (let i in obj) {
        str.push(`${i}=${rep(encodeURI(obj[i]))}`);
    }
    return str.join('&');
};

/**
 * dt: country
 * id: 0
 * type: move_in
 * date: 20200216
 * callback: jsonp_1581930616236_1831429
 * */
const formatParam = function(str) {
    let obj = {};
    str.split(/[\r\n]/).map(_ => _.trim()).filter(_ => _)
        .forEach(_ => {
            let __ = _.split(':').map(_ => _.trim());
            if (__.length === 2) {
                obj[__[0]] = __[1];
            } else {
                obj[__[0]] = '';
            }
        });
    return obj;
};

module.exports = {
    defaultHeader,
    getString,
    formatParam,
    get,
    getAdv,
    post,
    DownloadFile,
    repFn
};