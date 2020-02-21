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
const dtType = function (code) {
    if (code == "0") {
        return 'country';
    } else if (code.substring(2) === "0000") {
        return 'province';
    } else {
        return "city";
    }
};
let nextReqUrlType = ArrayToNext(['move_in','move_out']);
let reqUrlType = '';
let todayYMD = '';

let nextCode = function () {
    let city = cityCode.next();
    if (city) {
        console.log(`city:${city === "0" ? "中国" : code2All[city]}`);
        let str = `dt: ${dtType(city)}
            id: ${city}
            type: ${reqUrlType}
            callback: ibas`;
        get('http://huiyan.baidu.com/migration/historycurve.jsonp?' + getString(formatParam(str)))
            .then(data => {
                data = data.substring('ibas('.length,data.indexOf(')'));
                // console.log(data);
                // console.log(JSON.parse(data));
                fs.writeFileSync(`${tempPath}/${city}-${reqUrlType}.json`,data);
                allData.push(`"${city}":${data}`);
                nextCode();
            })
            .catch(console.log);
    } else {
        fs.writeFileSync(`${qianxiBaiduAdd("迁徙趋势/" + reqUrlType + '-' + todayYMD + '.json')}`,`{${allData.join(',')}}`,'utf-8');
        // allData = [];
        console.log(`date : ${reqUrlType} end`);
        nextDtType();
    }
};

// only today
let d = new Date();
todayYMD = (1900 + d.getYear()) + '-' + (d.getMonth() + 1) + '-' + d.getDate();
AutoNextDtType = true;
// nextReqUrlType.resetArray(['move_out']);
// nextReqUrlType.resetArray(['move_in']);
nextReqUrlType.resetArray(['move_in','move_out']);
let onlyToday = function () {
    return getFromDay(1900 + d.getYear(),d.getMonth() + 1,d.getDate(),false,true);
};
let allCb = () => {};
let nextDtType = function () {
    allData = [];
    reqUrlType = nextReqUrlType.next();
    if (reqUrlType) {
        console.log(`begin ${reqUrlType}`);
        cityCode.reset();
        nextDay = onlyToday();//getFromDay(1900 + d.getYear(),d.getMonth() + 1,d.getDate(),false,true);
        nextCode();
    } else {
        console.log(`all done`);
        allCb();
    }
};

function autoRun(cb) {
    nextDtType();
    allCb = cb;
}


module.exports = {autoRun};
