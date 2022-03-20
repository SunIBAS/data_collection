// 五粮液
let code = '000858';
// 挑选的字段
let field = ['日期','收盘'];
let datas = require(`./all/${code}.json`);
let o = `日期,开盘,收盘,最高,最低,成交量,成交额,振幅,涨跌幅,涨跌额,换手率`.split(',');
let out = [];
let fieldIndex = field.map(_ => {
    out.push([]);
    return o.indexOf(_);
});
datas.klines.forEach(line => {
    let sp = line.split(',');
    fieldIndex.forEach((fi,ind) => {
        if (fi) {
            out[ind].push(+sp[fi]);
        } else {
            out[ind].push(sp[fi]);
        }
    })
});
out.forEach(o => {
    console.log(JSON.stringify(o));
});
