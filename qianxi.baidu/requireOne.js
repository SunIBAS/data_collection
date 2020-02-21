const fs = require('fs');
const {
    get,
    getString,
    formatParam
} = require('./../_utils/Ajax');
const {
    code2All
} = require('./../_utils/cityCode');

const dtType = function (code) {
    if (code == "0") {
        return 'country';
    } else if (code.substring(2) === "0000") {
        return 'province';
    } else {
        return "city";
    }
};
const reqUrl = {
    province: 'http://huiyan.baidu.com/migration/provincerank.jsonp?',
    city : 'http://huiyan.baidu.com/migration/cityrank.jsonp?',
};
const tempPath = "e:\\temp2\\";

function getReqFn(keyword) {
    return function (tar) {
        tar = tar.split('-');
        let city = tar[1];
        let nd = tar[0];
        let reqUrlType = tar[2].split('.')[0];
        console.log(reqUrlType + '\t' + reqUrl[reqUrlType]);
        let str = `dt: ${dtType(city)}
            id: ${city}
            type: ${keyword}
            date: ${nd}
            callback: ibas`;
        get(reqUrl[reqUrlType] + getString(formatParam(str)))
            .then(data => {
                data = data.substring('ibas('.length,data.indexOf(')'));
                // console.log(data);
                // console.log(JSON.parse(data));
                fs.writeFileSync(`e:/temp2/${nd}-${city}-${reqUrlType}-${keyword}.json`,data);
            })
            .catch(console.log);
    }
}

// tar = "20200217-140400-province.json" || "20200217-140400-province-move-in.json"
function moveIn(tar) {
    getReqFn('move_in')(tar);
}

function moveOut(tar) {
    getReqFn('move_out')(tar);
}

function incity(tar) {
    // city-date-incity.json
    tar = tar.split('-');
    let city = tar[0];
    let nd = tar[1];
    if (city) {
        console.log(`city:${city === "0" ? "中国" : code2All[city]}`);
        let str = `dt: ${dtType(city)}
            id: ${city}
            date: ${nd}
            callback: ibas`;
        console.log('http://huiyan.baidu.com/migration/internalflowhistory.jsonp?' + getString(formatParam(str)));
        get('http://huiyan.baidu.com/migration/internalflowhistory.jsonp?' + getString(formatParam(str)))
            .then(data => {
                data = data.substring('ibas('.length,data.indexOf(')'));
                // console.log(data);
                // console.log(JSON.parse(data));
                fs.writeFileSync(`${tempPath}${city}-${nd}-incity.json`,data);
                // allData.push(`"${city}":${data}`);
                // nextCode(nd);
            })
            .catch(console.log);
    }
}

`220100-20200220-incity.json`.split(/[\r\n]/g)
    .map(_ => _.trim()).filter(_ => _)
    .forEach(_ => {
        if (_.indexOf("incity") !== -1) {
            incity(_)
        } else if (_.indexOf('move_out') !== -1) {
            moveOut(_);
        } else {
            moveIn(_);
        }
    });
