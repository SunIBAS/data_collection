const https = require("https");
const http = require('http');
const fs = require('fs');
const codes = require('./所有股票代码.json');
// codes[0].symbol
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
let formUrl = params => {
    let url = `http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?_var=kline_dayqfq2018&param=${params.code},day,${params.from},${params.to},${params.len},qfq&r=0.7818463044253692`;
    // console.log(url);
    return url;
};
// 下载一个股票 code = 'sh603160'
function downloadOneStoke(code) {
    return new Promise(function (cb) {
        let task = [];
        let allDatas = [];
        [2020,2019,2018,2017,2016,2015,2014,2013].map((_,ind) => {
            // if (ind) {
            //     return `${_}-01-01,${_}-12-31`;
            // } else {
            //     return `,`
            // }

            return `${_}-01-01,${_}-12-31`;
        }).map(_ => {
            let ft = _.split(',');
            return {
                code: code.toLowerCase(),
                type: 'day',
                from: ft[0],
                to: ft[1],
                len: 320
            }
        }).forEach(param => {
            task.push((function (param,code) {
                get(formUrl(param)).then(_ => {
                    let data = eval(_);
                    let arr = data.data[code].qfqday;
                    if (!arr) {
                        arr = data.data[code].day;
                    }
                    let next = true;
                    if (arr && arr.length) {
                        allDatas = arr.concat(allDatas);
                        next = !!task.length;
                    } else {
                        next = false;
                    }
                    if (next) {
                        setTimeout(() => {
                            task.shift()();
                        },200);
                    } else {
                        task = [];
                        cb(allDatas);
                    }
                });
            }).bind(null,param,code.toLowerCase()));
        });
        task.shift()();
    })
};

let allTasks = [];
let totalTasks = 0;
codes.forEach(code => {
    if (!fs.existsSync('./all/' + code.symbol.toLowerCase() + '.json')) {
        totalTasks++;
        allTasks.push((function (code) {
            console.log(`start to fetch code is ${code},percent is ${allTasks.length} / ${totalTasks}`);
            downloadOneStoke(code)
                .then(alldatas => {
                    fs.writeFileSync('./all/' + code + '.json',JSON.stringify(alldatas),'utf-8');
                    if (allTasks.length) {
                        console.log(`end to fetch code is ${code},percent is ${allTasks.length} / ${totalTasks}`);
                        setTimeout(() => {
                            allTasks.pop()();
                        },100)
                    }
                });
        }).bind(null,code.symbol))
    } else {
        console.log(`exist => ${code.symbol}`)
    }
});
allTasks.pop()();

// get('http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?_var=kline_dayqfq2018&param=sh603160,day,2019-01-01,2020-12-31,640,qfq&r=0.6788393043025942')
//     .then(_ => {
//         let data = eval(_);
//         let arr = data.data.sh603160.qfqday;
//         console.log(data);
//     });