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
        return "country";
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
            type: move_in
            date: ${nd}
            callback: ibas`;
        get(reqUrl[reqUrlType] + getString(formatParam(str)))
            .then(data => {
                data = data.substring('ibas('.length,data.indexOf(')'));
                // console.log(data);
                // console.log(JSON.parse(data));
                fs.writeFileSync(`e:/temp/${nd}-${city}-${reqUrlType}-move-in.json`,data);
                allData.push(`"${city}":${data}`);
                nextCode(nd);
            })
            .catch(console.log);
    } else {
        fs.writeFileSync(`./迁入地数据/${nd}-${reqUrlType}.json`,`{${allData.join(',')}}`,'utf-8');
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

let d = new Date();
let todayOnly = () => {
    return getFromDay(1900 + d.getYear(),d.getMonth() + 1,d.getDate(),false,true);
};
let OneDayOnly = (function (y,m,d,oy,om,od){
    return () => {
        return getFromDay(y,m,d,false,true,oy || y,om||m,od||d);
    }
})(2020,2,17,2020,2,19);
// nextReqUrlType.reset(['province']);
// nextReqUrlType.reset(['city']);
nextReqUrlType.reset(['city','province']);
let nextDtType = function () {
    reqUrlType = nextReqUrlType.next();
    if (reqUrlType) {
        console.log(`begin ${reqUrlType}`);
        nextDay = OneDayOnly();
        next();
    } else {
        console.log(`all done`);
    }
};

nextDtType();