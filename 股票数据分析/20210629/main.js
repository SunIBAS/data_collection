const fs = require('fs');
const all = require('./all.json'); // daten
// 日期文件
const dates = require('./dates.json');

const allJJR = [];

function initJJR() {
    for (let i = 0;i < dates.length;i++) {
        if (dates[i].type === 'jjr') {
            let obj = {
                begin: +dates[i].d.replace(/-/g,''),
                festival: dates[i].festival,
                desc: dates[i].desc,
                len: 0,
                end: +dates[i].d.replace(/-/g,'')
            };
            while (dates[i].type === 'jjr') {
                i++;
                if (!obj.festival && !obj.desc) {
                    obj.festival = dates[i].festival;
                    obj.desc = dates[i].desc;
                }
                obj.len++;
                obj.end = +dates[i].d.replace(/-/g,'');
            }
            if (obj.desc || obj.festival) {
                if (!obj.desc) {
                    obj.desc = obj.festival;
                }
                if (!obj.festival) {
                    obj.festival = obj.desc;
                }
                allJJR.push(obj);
            }
        }
    }
}
initJJR();

// 按节日，将日期进行对齐
function f() {

}
// 计算出所有基金在节日前后十天以内的涨跌值
const keepLen = 20;
function 节日前后十天() {
    let point = 0;
    let saveData = {};
    for (let i in all) {
        let klines = all[i].klines;
        point = 0;
        saveData[i] = {
            name: all[i].name,
            before: [],
            after: []
        };
        klines = klines.map(k => {
            if (k instanceof Array) {
                k = k[0];
            }
            k.daten = +k.daten;
            return k;
        });
        allJJR.forEach(jjr => {
            if (klines[0].daten > jjr.begin  + keepLen) {
                return;
            }
            if (klines[klines.length - 1].daten < jjr.begin) {
                return;
            }
            let fromPoint = 0,endPoint = 0;
            // 将索引指向该日期
            for (;point < klines.length;point++) {
                if (klines[point].daten >= jjr.begin) {
                    fromPoint = point - 1;
                    break;
                }
            }
            // 结束日
            for (;point < klines.length;point++) {
                if (klines[point].daten > jjr.end) {
                    endPoint = point;
                    break;
                }
            }
            let obj = {
                ...jjr,
                data: [],
            };
            if (!fromPoint) {
                return ;
            }
            let minEnd = keepLen;
            if (fromPoint < keepLen) {
                minEnd = fromPoint;
                for (let i = keepLen - minEnd;i >= 0;i--) {
                    obj.data.push(null);
                }
            }
            for (let t = minEnd;t >= 0;t--) {
                obj.data.push(klines[fromPoint - t].close);
            }
            saveData[i].before.push(obj);
            obj = {
                ...jjr,
                data: [],
            };
            // console.log(`endpoint = ${endPoint}\tklines.length = ${klines.length}`);
            let maxEnd = klines.length - endPoint - 1;
            if (endPoint === klines.length) {
                return;
            }
            maxEnd = maxEnd > keepLen + 1 ? keepLen + 1 : maxEnd;
            for (let t = 0;t < maxEnd;t++) {
                obj.data.push(klines[endPoint + t].close);
            }
            saveData[i].after.push(obj);
        });
        // break;
    }
    fs.writeFileSync('./an.json',JSON.stringify(saveData),'utf-8');
}
节日前后十天();