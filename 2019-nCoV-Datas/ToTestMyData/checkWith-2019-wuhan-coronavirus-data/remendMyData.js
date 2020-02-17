const netDataJson = require('./netDataJson.json');
const fs = require('fs');
const netBasePath = './../../test/sources/';
const jsonBasePath = "./../../data_json/";
const outTmp = './../../test/data_json/';
const code2Name = require('./../../source/others/cityCode.json').code2Name;

const toMyJsonFileName = (filename) => {
    return [filename.substring(0,4),
        '-',filename.substring(4,6),'-',
    filename.substring(6)].join('');
};

fs.readdirSync(netBasePath)
    .filter(_ => _.endsWith('.json'))
    .forEach(file => {
        let nd = require(netBasePath + file);
        let md = require(jsonBasePath + toMyJsonFileName(file));
        nd.forEach(province => {
            let code = netDataJson[province.provinceName];
            if (code in md) {
                md[code][2] = province.confirmedCount;
                md[code][3] = province.suspectedCount;
                md[code][4] = province.curedCount;
                md[code][5] = province.deadCount;
            } else {
                md[code] = [];
                md[code][0] = code;
                md[code][1] = province.provinceName;
                md[code][2] = province.confirmedCount;
                md[code][3] = province.suspectedCount;
                md[code][4] = province.curedCount;
                md[code][5] = province.deadCount;
            }
            province.cities.forEach(city => {
                let ccode = netDataJson[city.cityName];
                if ((ccode + '').length === 6) {
                    if (ccode in md) {
                        md[ccode][2] = city.confirmedCount;
                        md[ccode][3] = city.suspectedCount;
                        md[ccode][4] = city.curedCount;
                        md[ccode][5] = city.deadCount;
                    } else {
                        md[ccode] = [];
                        md[ccode][0] = ccode;
                        md[ccode][1] = code2Name[code][ccode];
                        md[ccode][2] = city.confirmedCount;
                        md[ccode][3] = city.suspectedCount;
                        md[ccode][4] = city.curedCount;
                        md[ccode][5] = city.deadCount;
                    }
                }
            });
        });
        fs.writeFileSync(outTmp + toMyJsonFileName(file),JSON.stringify(md),'utf-8');
        let arr = [];
        for (let i in md) {
            arr.push(md[i]);
        }
    });