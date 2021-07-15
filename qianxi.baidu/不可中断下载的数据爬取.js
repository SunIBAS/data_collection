const fs = require('fs');
const {
    get,
    getString,
    formatParam
} = require('./../_utils/Ajax');
const {
    getFromDay  // 用于遍历日期
} = require('./../_utils/getDays');
const {
    codes       // 城市代码 code2All flatten 版本
} = require('./AllCodes');
const {
    ArrayToNext     // 数组迭代器
} = require('./../_utils/ObjectToNext');
const {
    code2All        // 城市代码
} = require('./../_utils/cityCode');
const {
    qianxiBaiduAdd,     // 合并地址
    tempPath            // 临时地址
} = require('./../_utils/basePath');

// 请求接口
const reqUrl = {
    // 省 和 市 的接口
    province: 'http://huiyan.baidu.com/migration/provincerank.jsonp?',
    city : 'http://huiyan.baidu.com/migration/cityrank.jsonp?',
};
let nextReqUrlType = ArrayToNext(['city','province']);
let requestType = ArrayToNext(['move_in','move_out']);
const cityCode = ArrayToNext(codes);
let today = new Date();
const nextDay = getFromDay(2021,6,29,false,false,today.getFullYear(),
    today.getMonth() + 1,today.getDate() - 1);
// 获取类型
const dtType = function (code) {
    if (code == "0") {
        return 'country';
    } else if (code.substring(2) === "0000") {
        return 'province';
    } else {
        return "city";
    }
};

// let allData = [];
// 需要迭代的内容有
// 请求的城市
// 请求类型
// 请求日期
// 请求链接
// let city = cityCode.next();
// let str = `dt: ${dtType(city)}
//             id: ${city}
//             type: ${requestType.next()}
//             date: ${nextDay.next()}
//             callback: ibas`;
// get(reqUrl[nextReqUrlType.next()] + getString(formatParam(str)))
let getNextURL = (() => {
    let currentDay = nextDay();
    let currentQT = requestType.next();
    let currentRQT = nextReqUrlType.next();
    let currentCity = null;
    return function () {
        currentCity = cityCode.next();
        if (!currentCity) {
            cityCode.reset();
            // fs.writeFileSync(qianxiBaiduAdd(`迁出地数据/${currentDay}-${currentRQT}.json`),`{${allData.join(',')}}`,'utf-8');
            currentCity = cityCode.next();
            currentRQT = nextReqUrlType.next();
            if (!currentRQT) {
                nextReqUrlType.reset();
                // allData = [];
                currentRQT = nextReqUrlType.next();
                currentQT = requestType.next();
                if (!currentQT) {
                    requestType.reset();
                    currentQT = requestType.next();
                    currentDay = nextDay();
                    if (!currentDay) {
                        return false;
                    }
                }
            }
        }
        return {
            url: reqUrl[currentRQT] +
                    getString(formatParam(`dt: ${dtType(currentCity)}
                id: ${currentCity}
                type: ${currentQT}
                date: ${currentDay}
                callback: ibas`)),
            nd: currentDay,
            reqUrlType: currentRQT,
            city: currentCity,
            type: currentQT
        };
    }
})();
// let toNext = () => {};
let doing = false;
function doit(force) {
    if (!force) {
        if (doing) return;
    }
    doing = true;
    let obj = getNextURL();
    if (!obj) {
        console.log('over');
        process.exit();
        return ;
    }
    let writeOutFilePath = `${tempPath}/${obj.nd}-${obj.city}-${obj.reqUrlType}-${obj.type.replace('_','-')}.json`;
    if (fs.existsSync(writeOutFilePath)) {
        console.log(`文件已存在[${obj.nd}-${obj.city}-${obj.reqUrlType}-${obj.type.replace('_','-')}.json]`);
        return doit(true);
    }
    console.log(`开始请求[${obj.nd}-${obj.city}-${obj.reqUrlType}-${obj.type.replace('_','-')}.json]`);
    get(obj.url)
        .then(data => {
            data = data.substring('ibas('.length,data.indexOf(')'));
            // console.log(data);
            // console.log(JSON.parse(data));
            fs.writeFileSync(writeOutFilePath,data);
            //allData.push(`"${city}":${data}`);
            // if (data) {
            //     allData.push(`"${obj.city}":${data}`);
            // } else {
            //     cityCode.preMove(function (cc,pMove,move) {
            //         console.log(`Retry ${pMove.retryTime} times,error is continue code is ${cc}`);
            //     });
            // }
            // doit();
            doing = false;
        })
        .catch(console.log);
}
setInterval(function () {
    doit();
},100);
