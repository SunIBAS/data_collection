const fs = require('fs');

let jsons = fs.readdirSync('./all');

// {
//     code: 'code',
//     name: 'name',
//     dktotal: 5226,
//     klines: [
//     `日期,开盘,收盘,最高,最低,成交量,成交额,振幅,涨跌幅,涨跌额,换手率`
//     ]
// }
let testValue = ks => {
    let ret = false;
    let tlen = [];
    [20,40,60,80,100].map(len => {
        let ml = ks.slice(100 - len).filter(k => k > 4).length;
        ret |= ml > (len / 2);
        tlen.push(ml);
    });
    return {
        tlen,
        ret,
    };
};
let out = [];
jsons.filter(j => j.endsWith('.json')).forEach(j => {
    j = require(`./all/${j}`);
    let len = j.klines.length;
    if (len >= 100) {
        let maxLen = j.klines.slice(len - 100).map(k => Math.abs(+k.split(',')[8]));//.filter(k => k > 4).length;
        // if (maxLen > 50) {
        //     out.push([j.code,j.name,maxLen]);
        // }
        let t = testValue(maxLen);
        if (t.ret) {
            out.push([j.code,j.name,...t.tlen]);
        }
    }
});
console.log(out.map(_ => _.join(';')).join('\r\n'));
