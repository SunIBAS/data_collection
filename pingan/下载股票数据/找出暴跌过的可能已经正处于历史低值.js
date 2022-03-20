const fs = require('fs');

let all = fs.readdirSync('./all').filter(_ => _.endsWith('.json'));

const yeasInfo = {
    "1991": 242,
    "1992": 258,
    "1993": 253,
    "1994": 249,
    "1995": 244,
    "1996": 246,
    "1997": 242,
    "1998": 244,
    "1999": 237,
    "2000": 234,
    "2001": 237,
    "2002": 234,
    "2003": 240,
    "2004": 242,
    "2005": 241,
    "2006": 210,
    "2007": 240,
    "2008": 243,
    "2009": 199,
    "2010": 211,
    "2011": 242,
    "2012": 242,
    "2013": 233,
    "2014": 235,
    "2015": 244,
    "2016": 119,
    "2017": 196,
    "2018": 228,
    "2019": 233,
    "2020": 243,
    "2021": 183
};

const threeYearLen = 183 + 243 + 233;
const methodIndex = 2;

const commonMethods = {
    getMaxMinAndIndex(data) {
        let max = -1;
        let maxInd = -1;
        let min = 1e8;
        let minInd = -1;
        data.forEach((d,ind) => {
            if (max < d) {
                max = d;
                maxInd = ind;
            }
            if (min > d) {
                min = d;
                minInd = ind;
            }
        });
        return {
            max: +max,maxInd,
            min: +min,minInd,
        };
    },
};

// 留下数据，返回 对象，否则返回 false
const dearMethods = {
    m1(data) {
        let shouPan = [];
        let dates = [];
        data.klines.forEach(_ => {
            let sp = _.split(',');
            shouPan.push(sp[2]);
            dates.push(sp[0]);
        });
        if (dates.length < threeYearLen) {
            return false;
        }
        let maxV = -1;
        let maxVInd = 0;
        let minV = 1e8;
        let minInd = 0;
        shouPan.forEach((sp,ind) => {
            if (sp > maxV) {
                maxV = sp;
                maxVInd = ind;
            }
            if (sp < minV) {
                minV = sp;
                minInd = ind;
            }

        });
        let minV_ = minV;
        let minInd_ = minInd;
        minV = 1e8;
        minInd = 0;
        for (let i = maxVInd;i < shouPan.length;i++) {
            if (shouPan[i] < minV) {
                minV = shouPan[i];
                minInd = i;
            }
        }
        let jiCha = shouPan[maxVInd] - shouPan[minInd];
        let currentCha = shouPan[maxVInd] - shouPan[shouPan.length - 1];
        if (maxVInd + 190 > shouPan.length) {
            return false; // 不分析
        } else {
            // 计算和当前的差值 和波动幅度小于插值 1/6 高度的长度
            if (currentCha / jiCha < 0.4) {
                return false;
            } else {
                let cha16 = currentCha + jiCha / 6;
                let chaLen = 0;
                for (let i = shouPan.length - 2;i > maxVInd;i--) {
                    if (shouPan[i] > cha16) {
                        break;
                    }
                    chaLen++;
                }
                return {
                    jiChaRate: shouPan[minInd] / shouPan[maxVInd],
                    code: data.code,
                    name: data.name,
                    jicha: jiCha,
                    currentCha: currentCha,
                    chaLen: chaLen,
                    kline: shouPan,
                    dates
                };
            }
        }
    },
    /**
     * 只获取 收盘数据 和 日期，
     * 过滤：1.至少有三年数据
     *      2.最小值出现在最大值后面
     *      3.当前的值小于最大值和最小值的平均值
     *      4.必须没退市
     *      5.去除科创版
     *      6.去掉 st
     * 当前值 / (max + min) 值越小得分越高
     * @param data
     */
    m2(data) {
        let shouPan = [];
        let dates = [];
        data.klines.forEach(_ => {
            let sp = _.split(',');
            shouPan.push(sp[2]);
            dates.push(sp[0]);
        });
        if (dates[dates.length - 1] !== "2021-10-08") {
            return false;
        }
        if (dates.length < threeYearLen) {
            return false;
        }
        if (data.code[0] === '3') {
            return false;
        }
        if (data.name.startsWith('ST') || data.name.startsWith("*ST")) {
            return false;
        }
        let {max,maxInd,min,minInd} = commonMethods.getMaxMinAndIndex(shouPan);
        if (minInd > maxInd) {
            let cur = +shouPan[shouPan.length - 1];
            if (cur * 2 < max + min) {
                return {
                    code: data.code,
                    name: data.name,
                    kline: shouPan.map(_ => +_),
                    dates,
                    rate: 1 - cur / (max + min)
                };
            } else {
                // console.log(`half = ${cur / (max + min)}`);
                return false;
            }
        } else {
            return false;
        }
    }
};

// 对应 dearMethods 的方法
const sortMethods = {
    sort1(a,b) {
    let scoreA = a.chaLen;// + a.jiChaRate / 5;
    let scoreB = b.chaLen;// + b.jiChaRate / 5;
    return scoreA > scoreB;
},
    sort2(a,b) {
        return a.rate - b.rate;
    },
};

const dearFile = file => {
    let data = require(`./all/${file}`);
    return dearMethods[`m${methodIndex}`](data);
};
let rec = [];
all.forEach(file => {
    // 获取最高点
    let ret = dearFile(file);
    if (ret) {
        rec.push(ret);
        // console.log(JSON.stringify(ret));
    }
});
let sort = (a,b) => {
    let scoreA = a.chaLen;// + a.jiChaRate / 5;
    let scoreB = b.chaLen;// + b.jiChaRate / 5;
    return scoreA > scoreB;
};

let makeEcOptions = obj => {
    let option = {
        title: {
            text: `${obj.name}\t${obj.code}`
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: obj.dates
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Highest',
                type: 'line',
                data: obj.kline,
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ]
                }
            }
        ]
    };
    return option;
};

rec = rec.sort(sortMethods[`sort${methodIndex}`]).reverse().slice(0,20).map(o => {
    return {
        name: o.name,
        opt: makeEcOptions(o),
    }
});
fs.writeFileSync('./datas.json',JSON.stringify(rec),'utf-8');
// console.log(rec);

