const fs = require('fs');
const {
    get,
    getString,
    formatParam
} = require('./../_utils/Ajax');
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

let outputPath = qianxiBaiduAdd("城内出行强度");
let allCB = () => {};

let nextCode = function (nd) {
    let city = cityCode.next();
    if (city) {
        console.log(`city:${city === "0" ? "中国" : code2All[city]}`);
        let str = `dt: ${dtType(city)}
            id: ${city}
            date: ${nd}
            callback: ibas`;
        get('http://huiyan.baidu.com/migration/internalflowhistory.jsonp?' + getString(formatParam(str)))
            .then(data => {
                data = data.substring('ibas('.length,data.indexOf(')'));
                // console.log(data);
                // console.log(JSON.parse(data));
                fs.writeFileSync(`${tempPath}/${city}-${nd}-incity.json`,data);
                allData.push(`"${city}":${data}`);
                nextCode(nd);
            })
            .catch(console.log);
    } else {
        fs.writeFileSync(`${outputPath}/${nd}.json`,`{${allData.join(',')}}`,'utf-8');
        allData = [];
        console.log(`date : ${nd} end`);
        allCB();
    }
};

// only today
let d = new Date();
let today = (1900 + d.getYear()) + '' + (d.getMonth() + 1) + '' + d.getDate();

function autoRunCNCXQD(cb) {
    allCB = cb;
    nextCode(today);
}

module.exports = { autoRunCNCXQD };