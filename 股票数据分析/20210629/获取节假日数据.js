const {
    get
} = require('./../../_utils/Ajax');
const fs = require('fs');
const path = require('path');
const savePath = './datas/';

let ym = (() => {
    let o = [];
    for (let i = 2011;i < 2021 + 1;i++) {
        for (let j = 1;j < 12 + 1;j++) {
            o.push({
                year: i,
                month: j
            });
        }
    }
    return o;
})();
let getMonthDays = (obj) => {
    let theMonth = obj.month - 1;
    let month = [31,28,31,30,31,30,31,31,30,31,30,31];
    let years = [2000,2004,2008,2012,2016,2020,2024];
    if (theMonth !== '2') {
        return month[theMonth];
    } else {
        if (years.includes(+obj.year)) {
            return 29;
        } else {
            return 28;
        }
    }
};

let url = (obj) => {
    return `https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?
    query=${obj.year}%E5%B9%B4${obj.month}%E6%9C%88&co=&resource_id=39043&
    t=${new Date().getTime()}&ie=utf8&oe=gbk&cb=op_aladdin_callback&format=json&
    tn=wisetpl&cb=callback&_=1624981279114`
        .split('\n').map(_ => _.trim()).join('');
};

// get(url(codes[0]))
// .then(console.log);
let doing = false;
let getSeries = () => {
    if (doing) return;
    doing = true;
    let obj = ym.shift();
    console.log(`正在请求 ${obj.year} - ${obj.month}`);
    if (fs.existsSync(`${savePath}${obj.year}-${obj.month}.json`)) {
        console.log(`${obj.year} - ${obj.month} 已存在`);
        doing = false;
        return ;
    }
    get(url(obj))
        .then(content => {
            // content = content
            处理请求回来的数据(content,obj);
            if (!ym.length) {
                console.log('完成');
                // process.exit();
                汇集数据();
            } else {
                doing = false;
            }
        });
};
const to2 = s => `${s.length < 2 ? '0' : ''}${s}`;
const 周末 = ['六','日'];
function 处理请求回来的数据(content,obj,cb) {
    content = JSON.parse(content.substring('/**/callback('.length,content.length - 2));
    content = content.data[0].almanac;
    // 第一步将数据滚动到当前月份
    let ind = 0;
    while (+content[ind].month !== obj.month) {
        ind++;
    }
    if (ind + getMonthDays(obj) - 1 <= content.length) {
        let saveDatas = [];
        let ymString = `${content[ind].year}-${to2(content[ind].month)}-`
        while (+content[ind].month === obj.month) {
            if (content[ind].status) {
                // 2015-12-09
                saveDatas.push({
                    d: `${ymString}${to2(content[ind].day)}`,
                    type: 'jjr',
                    desc: content[ind].desc,
                    festival: content[ind].festival
                });
            } else {
                if (!周末.includes(content[ind].cnDay)) {
                    saveDatas.push({
                        d: `${ymString}${to2(content[ind].day)}`,
                        type: 'nor',
                        desc: content[ind].desc,
                        festival: content[ind].festival
                    });
                }
            }
            ind++;
        }
        if (cb) {
            cb(saveDatas)
        } else {
            fs.writeFileSync(`${savePath}${obj.year}-${obj.month}.json`,JSON.stringify(saveDatas));
        }
    } else {
        throw new Error("很奇怪");
    }
}
function 开始收集数据() {
    setInterval(() => {
        getSeries();
    },1000);
}
// 开始收集数据();
function 汇集数据() {
    console.log('开始汇集数据');
    let allDatas = [];
    fs.readdirSync('./datas')
        .filter(_ => _.endsWith('.json'))
        .filter(_ => _.startsWith('2'))
        .forEach(f => {
            let data = JSON.parse(fs.readFileSync(`${savePath}${f}`,'utf-8'));
            allDatas.push(data.map(d => {
                d.n = +d.d.replace(/-/g,'');
                return d;
            }));
        });
    fs.writeFileSync('./dates.json',JSON.stringify([].concat(...allDatas)),'utf-8');
    process.exit();
}
// 汇集数据();

function 生成收集命令() {
    let cmds = [];
    ym.forEach(y => {
        cmds.push(`scurl o=./datas/${y.year}-${y.month}.json "${url(y)}"`);
    });
    fs.writeFileSync('./cmds.bat',cmds.join('\r\n'),'utf-8');
}
生成收集命令();
function 命令生成汇集数据() {
    let saveDatas = [];
    ym.forEach(y => {
        let content = fs.readFileSync(`${savePath}${y.year}-${y.month}.json`,'utf-8');
        处理请求回来的数据(content,y,function (obj) {
            saveDatas.push(obj);
        });
    });
    fs.writeFileSync('./dates.json',JSON.stringify([].concat(...saveDatas)),'utf-8');
    process.exit();
}
命令生成汇集数据();

// console.log(url({year: 2001,month: 1}));