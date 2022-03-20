const {
    get
} = require('./../../_utils/Ajax');
let all = require('./../stock/datas/沪深A.json'); // {f12:code,f14:name}
const fs = require('fs');

const url = code => `http://push2his.eastmoney.com/api/qt/stock/kline/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61&beg=0&end=20500101&ut=fa5fd1943c7b386f172d6893dbfba10b&rtntype=6&secid=1.${code}&klt=101&fqt=1&cb=cb`;

// let record = require('./record.json');
let getting = false;
const getCode = code => {
    getting = true;
    console.log(`getting ${JSON.stringify(code)}`);
    get(url(code.f12))
        .then(ret => {
            return JSON.stringify(JSON.parse(ret.substring(3,ret.length - 2)).data);
        })
        .then(ret => {
            // ret = {
            //     code: 'code',
            //     name: 'name',
            //     dktotal: 5226,
            //     klines: [
            //         `日期,开盘,收盘,最高,最低,成交量,成交额,振幅,涨跌幅,涨跌额,换手率`
            //     ]
            // };
            if (ret.length === 4) {
                all.unshift(code);
            } else {
                // record.push({
                //     ...code,
                //     length: ret.length
                // });
                fs.appendFileSync(`./all/${code.f12}.json`,ret,'utf-8');
            }
            getting = false;
        })
        .catch(e => {
            console.log(e);
            all.push(code);
        });
}

const id = setInterval(() => {
    if (getting) {} else {
            if (all.length) {
            let code = all.pop();
            console.log(`剩余${all.length}`);
            if (!fs.existsSync(`./all/${code.f12}.json`)) {
                getCode(code);
            }
        } else {
            console.log('over');
            clearInterval(id);
        }
    }
},100);
