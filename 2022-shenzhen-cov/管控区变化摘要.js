const fs = require('fs');
const path = require('path');

const jsonPath = './管控区';

// 摘要
const abstr = {
    everyDay: {},
    level: {},
    province: {}
};
let totalLevel = {};
fs.readdirSync(jsonPath).forEach(f => {
    let date = f.split('.')[0].split('_').map(_ => _.length < 2 ? `0${_}` : _).join('');
    let json = require(jsonPath + '/' + f);
    // console.log(json);
    let currentLevel = {};
    for (let i in json) {
        // 省份
        let pc = i.split('_');
        let province = pc[0];
        let city = pc[1];
        if (!abstr.province[province]) {
            abstr.province[province] = {
                number: 0,
                city: []
            }
        }
        abstr.province[province].number++;
        if (city) {
            abstr.province[province].city.push(city);
        }
        json[i].data.map(_ => _.x).forEach(d => {
            if (!totalLevel[d.level]) {
                totalLevel[d.level] = 0;
            }
            if (!currentLevel[d.level]) {
                currentLevel[d.level] = 0;
            }
            totalLevel[d.level]++;
            currentLevel[d.level]++;
        });
        abstr.everyDay[date] = currentLevel;
    }
    abstr.level = totalLevel;
});

for (let i in abstr.province) {
    if (abstr.province[i].city.length) {
        console.log(`${i} 共 ${abstr.province[i].number} 个市/区有封控管制，如下：`)
        console.log(abstr.province[i].city.join('\t'));
    } else {
        console.log(`直辖市 ${i}`);
    }
}
for (let i in abstr.everyDay) {
    console.log(`${i} 数据如下`);
    for (let j in abstr.everyDay[i]) {
        console.log(`${j} : ${abstr.everyDay[i][j]} 处`);
    }
}

