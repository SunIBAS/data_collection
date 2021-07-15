// 20210607-513200-province-move-out.json
const fs = require('fs');
const path = require('path');
const {
    get,
    getString,
    formatParam
} = require('./../_utils/Ajax');
const {
    qianxiBaiduAdd,     // 合并地址
    tempPath            // 临时地址
} = require('./../_utils/basePath');

let filename = "20210607-513200-province-move-out.json";
const reqUrl = {
    // 省 和 市 的接口
    province: 'http://huiyan.baidu.com/migration/provincerank.jsonp?',
    city : 'http://huiyan.baidu.com/migration/cityrank.jsonp?',
};
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
const filename2obj = filename => {
    let sps = filename.split('.json')[0].split('-');
    return {
        nd: sps[0],
        city: sps[1],
        reqUrlType: sps[2],
        type: sps[3],
        url: reqUrl[sps[2]] + getString(formatParam(`dt: ${dtType(sps[1])}
                id: ${sps[1]}
                type: ${sps[3]}
                date: ${sps[0]}
                callback: ibas`)),
    }
}
let obj = filename2obj(filename);
console.log(`开始请求[${obj.nd}-${obj.city}-${obj.reqUrlType}-${obj.type.replace('_','-')}.json]`);
get(obj.url)
    .then(data => {
        data = data.substring('ibas('.length,data.indexOf(')'));
        console.log(data);
        // console.log(data);
        // console.log(JSON.parse(data));
        fs.writeFileSync(path.join(tempPath,filename),data);
        //allData.push(`"${city}":${data}`);
        // if (data) {
        //     allData.push(`"${obj.city}":${data}`);
        // } else {
        //     cityCode.preMove(function (cc,pMove,move) {
        //         console.log(`Retry ${pMove.retryTime} times,error is continue code is ${cc}`);
        //     });
        // }
        // doit();
    })
    .catch(console.log);