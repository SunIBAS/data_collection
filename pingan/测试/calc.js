const fs = require('fs');
function calc(code,buyP,sealP,hand,totalCash,fromYear,fromMonth) {
    // 603335 5.1~5.3
    // 002915 19~20

    // date,start,end,max,min,hand
    if (!fs.existsSync(`./datas/${code}.json`)) {
        return {
            code: -1,
            message: `code = ${code} 没有找到这个数据`
        };
    }
    const sz = require(`./datas/${code}.json`);
    const Dear = require('./Dear');

    let d = new Dear(buyP,sealP,hand,totalCash);

    sz.forEach(s => {
        if (+ s[0].substring(0,4) < fromYear) {
            return;
        } else if (+ s[0].substring(0,4) === fromYear && +s[0].substring(5,7) < fromMonth) {
            return;
        }
        let min = Math.min(+s[1],+s[2],+s[4]);
        let max = Math.max(+s[1],+s[2],+s[3]);

        if (s[0] === '2020-07-24') {
            console.log("")
        }
        d.buyIn(min,s[0]);
        d.sealAll(max,s[0]);
    });

    return {
        code: 200,
        option: d.writeOutBuySeal(sz,fromYear,true),
        dear: d,
    };
}
module.exports = calc;