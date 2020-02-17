const fs = require("fs");
const pro = require('./others/cityCode.json').province2Code;
const cityNameChange = require('./changeName.js').cityNameChange;

const file = {
    '1-31.csv': '2020-01-31.txt',
    '2-1.csv': '2020-02-01.txt',
    '2-2.csv': '2020-02-02.txt',
    '2-3.csv': '2020-02-03.txt',
};

const more = {
    "中国": `11791	17988	243	259
14380	19544	328	304
17205	21558	475	361
20438	23214	632	425`.split(/[\r\n]/).map(_ => _.split('\t').filter(_ => _)),
    "香港": `13	0	0	0
14	0	0	0
15	0	0	0
15	0	0	0`.split(/[\r\n]/).map(_ => _.split('\t').filter(_ => _))
};

let ind = 0;
for (let i in file) {
    let out = [
        ["flag","area","confirmed","suspected","cured","dead"]
    ];
    let keys = [];
    out.push([-2,"中国",more.中国[ind][0],more.中国[ind][1],more.中国[ind][2],more.中国[ind][3]]);
    out.push([-1,"香港特别行政区",more.香港[ind][0],more.香港[ind][1],more.香港[ind][2],more.香港[ind][3]]);
    ind++;
    console.log(i);
    fs.readFileSync('csvFile\\' + i,'utf-8')
        .split(/[\r\n]/)
        .map(_ => _.split(','))
        .forEach((line,ind) => {
            if (!ind) {
                return;
            }
            if (line[0] in pro && !keys[line[0]]) {
                keys[line[0]] = true;
                out.push([
                    -1,
                    line[0],
                    line[2],
                    line[3],
                    line[4],
                    line[5]
                ]);
            }
            if (line[1] && !keys[line[1]]) {
                keys[line[1]] = true;
                out.push([
                    pro[line[0]],
                    cityNameChange(line[1]),
                    line[6],
                    line[7],
                    line[8],
                    line[9]
                ]);
            }
        });
    fs.writeFileSync(`../datas/${file[i]}`,out.map(_ => _.join(',')).join('\r\n'));
}



