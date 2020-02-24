const fs = require('fs');
const {
    get,
    getString,
    formatParam
} = require('./../_utils/Ajax');
const {
    getFromDay
} = require('./../_utils/getDays');
const {
    codes
} = require('./AllCodes');
const {
    ArrayToNext
} = require('./../_utils/ObjectToNext');
const {
    code2All
} = require('./../_utils/cityCode');
const {
    qianxiBaiduAdd,
    tempPath
} = require('./../_utils/basePath');

const cityCode = ArrayToNext(codes);
let nextDay;// = getFromDay(2020,1,2,false,true);
let allData = [];
const reqUrl = {
    province: 'http://huiyan.baidu.com/migration/provincerank.jsonp?',
    city : 'http://huiyan.baidu.com/migration/cityrank.jsonp?',
};
const dtType = function (code) {
    if (code == "0") {
        return 'country';
    } else if (code.substring(2) === "0000") {
        return 'province';
    } else {
        return "city";
    }
};
let nextReqUrlType = ArrayToNext(['city','province']);
let reqUrlType = '';

let nextCode = function (nd) {
    let city = cityCode.next();
    if (city) {
        console.log(`fetching date:${nd} city:${city === "0" ? "中国" : code2All[city]}`);
        let str = `dt: ${dtType(city)}
            id: ${city}
            type: move_out
            date: ${nd}
            callback: ibas`;
        get(reqUrl[reqUrlType] + getString(formatParam(str)))
            .then(data => {
                data = data.substring('ibas('.length,data.indexOf(')'));
                // console.log(data);
                // console.log(JSON.parse(data));
                fs.writeFileSync(`${tempPath}/${nd}-${city}-${reqUrlType}-move-out.json`,data);
                //allData.push(`"${city}":${data}`);
                if (data) {
                    allData.push(`"${city}":${data}`);
                } else {
                    cityCode.preMove(function (cc,pMove,move) {
                        console.log(`Retry ${pMove.retryTime} times,error is continue code is ${cc}`);
                    });
                }
                nextCode(nd);
            })
            .catch(console.log);
    } else {
        fs.writeFileSync(qianxiBaiduAdd(`迁出地数据/${nd}-${reqUrlType}.json`),`{${allData.join(',')}}`,'utf-8');
        allData = [];
        console.log(`date : ${nd} end`);
        next();
    }
};
let next = function () {
    let nd = nextDay();
    if (nd) {
        console.log(`date : ${nd} begin`);
        allData = [];
        cityCode.reset();
        nextCode(nd);
    } else {
        nextDtType();
        console.log(`${reqUrlType} done`);
    }
};

let predayOnly = () => {
    let d = new Date();
    d.setTime(d.getTime() - 24 * 3600 * 1000);
    return getFromDay(1900 + d.getYear(),d.getMonth() + 1,d.getDate(),false,true,1900 + d.getYear(),d.getMonth() + 1,d.getDate());
};
let OneDayOnly = (function (y,m,d,oy,om,od){
    return () => {
        return getFromDay(y,m,d,false,true,oy || y,om||m,od||d);
    }
});//(2020,2,19,2020,2,19);
let creatDayNext = function() {};
nextReqUrlType.reset(['city','province']);
let totalCb = () => {};
let nextDtType = function () {
    reqUrlType = nextReqUrlType.next();
    if (reqUrlType) {
        console.log(`begin ${reqUrlType}`);
        nextDay = creatDayNext();
        next();
    } else {
        console.log(`all done`);
        totalCb();
    }
};


/** 只下载前一天的数据 **/
function callPreDay(cb) {
    creatDayNext = predayOnly;
    totalCb = cb;
    nextDtType();
}
function callDayRange(cb,y,m,d,ey,em,ed) {
    creatDayNext = OneDayOnly(y,m,d,ey,em,ed);
    totalCb = cb;
    nextCode();
}

module.exports = {
    callDayRange,
    callPreDay
};