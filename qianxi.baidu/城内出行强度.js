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
const {
    getToday
} = require('./../_utils/getDays');

let cityCode = ArrayToNext(codes);
let allData = [];
const dtType = function (code) {
    if (code === "110000" || code === "120000" || code === "310000" || code === "500000") {
        return "city";
    }
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
                // allData.push(`"${city}":${data}`);
                if (data) {
                    if (JSON.parse(data).errno === 0) {
                        allData.push(`"${city}":${data}`);
                    } else {
                        console.log(`${city} get errno is not zero`);
                        cityCode.preMove(function (cc,pMove,move) {
                            console.log(`Retry ${pMove.retryTime} times,error is continue code is ${cc}`);
                        });
                    }
                } else {
                    cityCode.preMove(function (cc,pMove,move) {
                        console.log(`Retry ${pMove.retryTime} times,error is continue code is ${cc}`);
                    });
                }
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
let today = getToday();

function autoRunCNCXQD(cb) {
    allCB = cb;
    nextCode(today);
}

module.exports = {
    autoRunCNCXQD,
    getCodes(codes,cb) {
        cityCode = ArrayToNext(codes);
        autoRunCNCXQD(cb);
    }
};