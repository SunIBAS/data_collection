/**
 * 依据每天的实际确诊数，绘制出一个确诊地图，将数据提取到json中
 * */
const fs = require('fs');
const path = require('path');
const baseMap = require('./html/out/_map.json');
const basePath = (() => {
    let projectName = "2019-nCoV-Datas";
    let cwd = process.cwd();
    return cwd.substring(0,cwd.indexOf(projectName) + projectName.length);
})();
const field = 'caseList';
const copyOneMap = (data) => {
    let map = [];
    baseMap.forEach(f => {
        // if (f.properties.name === "武汉市") {
        //     console.log(f);
        // }
        if (f.properties.code in data) {
            f.properties[field] = data[f.properties.code][2];
            map.push(f);
        } else {
            f.properties[field] = 0;
            map.push(f)
        }
    });
    return {"type":"FeatureCollection","features":map};
};
console.log(basePath);
fs.readdirSync(path.join(basePath,'data_json'))
    .filter(_ => _.endsWith('.json'))
    .forEach(json => {
        let data = require(path.join(basePath,'data_json',json));
        let map = copyOneMap(data);
        fs.writeFileSync(path.join(basePath,'extend','web','html','out',json),JSON.stringify(map));
    });


