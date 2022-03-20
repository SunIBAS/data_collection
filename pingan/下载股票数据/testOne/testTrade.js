// 测试
const fs = require('fs');
const {
    getOption
} = require('./dearWithLine.node.js');
const dataPath = './all/';
// const data = require('./sxfj.json').KlineData;

const formatJson = json => {
    //  let o = `日期,开盘,收盘,最高,最低,成交量,成交额,振幅,涨跌幅,涨跌额,换手率`.split(',');
    return {
        data: json.klines.map(_ => _.split(',')).map(o => {
            return {
                Close: +o[2],
                Open: +o[1],
                Low: +o[4],
                High: +o[3],
                Time:o[0]
            }
        }),
        code: json.code,
        name: json.name
    }
};
// 模拟交易
class Sim {
    constructor(opt) {
        this.trade = {
            nodes: [],
            index: [],
            dates: [],
            earns: [],
            last: 1,
            in: false,
            inNode: null,
            times: 0
        };
        // this.opt = opt;
        this.high = 0;
        this.low = 0;
        this.max = 0;
        this.min = 0;
        this.init(opt);
        this.lastDeta = opt.deta[opt.deta.length - 1];
        this.lastNode = null;
        this.opt = opt;
    }
    init(opt) {
        let min = 1e5;
        let max = 0;
        let avg = 0;
        for (let i = 0;i < opt.deta.length;i++) {
            let d = opt.deta[i];
            if (d) {
                max = d > max ? d : max;
                min = min > d ? d : min;
                avg += d;
            }
        }
        avg = avg / opt.deta.length;
        let lev = (max - min) / 20;
        this.high = max - lev * 1;
        this.low = lev * 4 + min;
        this.max = max;
        this.min = min;
        // console.log(`low = ${this.low}\thigh = ${this.high}`);
    }
    updateLH() {
        if (this.lastDeta > this.max) {
            this.max = this.lastDeta;
        } else if (this.lastDeta < this.min) {
            this.min = this.lastDeta;
        }
        let lev = (this.max - this.min) / 20;
        this.high = this.max - lev * 1;
        this.low = lev * 5 + this.min;
    }
    // node = {Close:1,Open:1,Low:1,High:1,Time:1}
    nexter(node,index) {
        let rate = 1;
        if (this.trade.in) {
            rate = (this.lastNode.Close - this.trade.inNode.Open) / this.trade.inNode.Open;
        }
        // 卖出
        if ((this.lastDeta > this.high || rate <= 0.98) && this.trade.in) {
            let ind = this.trade.index[this.trade.index.length - 1];
            this.trade.in = false;
            this.trade.dates[this.trade.dates.length - 1].push(node.Time);
            this.trade.index[this.trade.index.length - 1].push(index);
            this.trade.nodes.push([this.trade.inNode,this.lastNode]);
            let rate = (this.lastNode.Close - this.trade.inNode.Open) / this.trade.inNode.Open;
            this.trade.earns.push(rate);
            this.trade.last *= (1 + rate);
            this.times++;
        }
        if (this.lastDeta < this.low && !this.trade.in) {
            this.trade.in = true;
            this.trade.inNode = node;
            this.trade.dates.push([node.Time]);
            this.trade.index.push([index]);
        }
        if (node)
        {
            this.lastDeta = this.addAvg(node.Close);
            this.lastNode = node;
            this.updateLH();
            // console.log(`lastDeta = ${this.lastDeta}`);
        }
    }
    // 添加均值
    addAvg(n) {
        let min = 1e5;
        let max = 0;
        for (let i = 0;i < linesLen;i++) {
            // opt.
            let d = this.opt.daySum[i].getAvg(n);
            this.opt.ma[i].push(d);
            max = d > max ? d : max;
            min = min > d ? d : min;
        }
        this.opt.deta.push(max - min);
        return max - min;
    }
}
// 添加均值
// let addAvg = function (n) {
//     let min = 1e5;
//     let max = 0;
//     for (let i = 0;i < linesLen;i++) {
//         // opt.
//         let d = opt.daySum[i].getAvg(n);
//         opt.ma[i].push(d);
//         max = d > max ? d : max;
//         min = min > d ? d : min;
//     }
//     opt.deta.push(max - min);
//     return max - min;
// };
let lines = [5,10,15];
let linesLen = lines.length;

function toTry(file) {
    // file = './all/601988.json'
    const {
        data,
        code,
        name,
    } = formatJson(require(file));
    // console.log(data.length)
    let gussLen = data.length / 5;
    if (gussLen > 500) {
        gussLen = 500;
    }
    let fromGuss = data.length - gussLen;
    let data_pre = data.slice(0,fromGuss);
    let data_next = data.slice(fromGuss);
    // klines,lines,dataName,guss,cutLength
    let opt = getOption(data_pre,lines);

    let s = new Sim(opt);
    for (let i = 0;i < data_next.length;i++) {
        s.nexter(data_next[i],i + fromGuss);
    }

// console.log(JSON.stringify(s.trade));
// let markArea = {
//     data: s.trade.index.filter(_=>_.length===2).map(ind => {
//         if (ind.length === 1) {
//             ind.push(data.length.toString());
//         }
//         return [
//             {
//                 // name: 'Evening Peak',
//                 xAxis: ind[0].toString(),
//             },
//             {
//                 xAxis: ind[1].toString(),
//             }
//         ]
//     })
// };
// opt = getOption(data,lines,null,null);
// opt.option.series[0].markArea = markArea;
// opt.option.title = {
//     text: `percent = ${s.trade.last}`
// };
// fs.writeFileSync('./options.js','option = ' + JSON.stringify(opt.option),'utf-8');
    return {
        rate: s.trade.last,
        len: gussLen,
        code,name,
    }
}

// let o = toTry('./all/000001.json')
// console.log(o)
let contents = fs.readdirSync(dataPath).map(file => {
    if (file.endsWith('.json')) {
        return toTry(`./.${dataPath}${file}`);
    } else {
        return null;
    }
}).map(o => {
    if (o) {
        return `${o.code},${o.name},${o.len},${o.rate},${o.rate > 1 ? 'T' : 'F'}`;
    } else {
        return '';
    }
}).join('\r\n');
fs.writeFileSync('./testOne/result.csv',contents,'utf-8');


// console.log(fs.readdirSync(dataPath).length);
