let fs = require('fs');
const pro = require('./others/cityCode.json').province2Code;
const cityNameChange = require('./changeName.js');

// 格式化时间的[月]和[日]
(() => {
    let zeros = [0,0,0,0,0,0,0,0];

    let changeZeroLength = function(deta) {
        if (zeros.length < deta) {
            for (;deta > zeros.length;deta--) {
                zeros.push(0);
            }
        }
    };
    Number.prototype.toLength = function (len) {
        return (this + '').toLength(len);
    };
    String.prototype.toLength = function (len) {
        let n = this;
        if (n.length < len) {
            let deta = len - (n + '').length;
            changeZeroLength(deta);
            return zeros.slice(0,deta).join('') + n;
        } else {
            return n;
        }
    };
})();

let files = {};
fs.readdirSync('jsonFile').filter(_ => _.endsWith(".json")).forEach(_ => {
        files[_] = '2020-' + _.split('.')[0]
            .split('-')
            .map(_ => _.toLength(2)).join('-') + '.txt';
    });

for (let i in files) {
    let json = require('./jsonFile/' + i).component[0];
    let out = [
        ["flag","area","confirmed","suspected","cured","dead"]
    ];
    out.push([-2,"中国",json.summaryDataIn.confirmed,
        json.summaryDataIn.unconfirmed,
        json.summaryDataIn.cured,
        json.summaryDataIn.died]);
    json.caseList.forEach(province => {
        let provinceName = cityNameChange.provinceNameChange(province.area);
        let provinceIndex = pro[provinceName];
        out.push([-1,provinceName,province.confirmed,
            0,
            province.crued,
            province.died]);
        if (province.subList && province.subList.length) {
            province.subList.forEach(city => {
                out.push([provinceIndex,
                    cityNameChange.cityNameChange(city.city),
                    city.confirmed || 0,
                    0,
                    city.crued || 0,
                    city.died || 0]);
            });
        }
    });
    fs.writeFileSync('../datas/' + files[i],out.map(_ => _.join(',')).join('\r\n'));
}

console.log(files);