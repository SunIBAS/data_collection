const fs = require('fs');
const codes = require('./others/cityCode.json').province2Code;
const cityNameChange = require('./changeName.js').cityNameChange;

let data = {};
fs.readFileSync("all.txt","utf-8")
    .split(/[\r\n]/).map(_ => _.split(','))
    .filter(_ => _[1] === "中国")
    .forEach(_ => {
        if (_[0] in data) {} else {
            data[_[0]] = [];
        }
        data[_[0]].push(_);
    });

let out = [];
for (let i in data) {
    out = [
        ["flag","area","confirmed","suspected","cured","dead"]
    ];
    data[i].forEach(d => {
        if (d[5]) {
            out.push([
                pro[d[3]],cityNameChange(d[5]),
                d[7],d[8],d[9],d[10]
            ]);
        } else if (d[3]) {
            out.push([
                -1,d[3],
                d[7],d[8],d[9],d[10]
            ]);
        } else {
            out.push([
                -2,d[1],
                d[7],d[8],d[9],d[10]
            ]);
        }
    });
    fs.writeFileSync(`../datas/${i}.txt`,out.map(_ => _.join(',')).join('\r\n'));
}

