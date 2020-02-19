const https = require("https");
const http = require("http");
const qs = require("querystring")

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

const getString = function(obj) {
    let str = [];
    for (let i in obj) {
        str.push(`${i}=${obj[i]}`);
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
    getString,
    formatParam,
    get
};