const exec = require('child_process').exec;
const path = require('path');
const codes = require('./../stock/datas/沪深A.json');
const {
    post,get
} = require('./../../_utils/Ajax');
let currentPath = path.dirname(process.argv[1]);

let time = (() => {
    let d = new Date();
    return d.toISOString().substring(0,10).replace(/-/g,'');
})();
let url = code => {
    return `https://gwapi.eastmoney.com/agent/1258/stockcomment/api/so/${code}.json?cb=cb&appid=1466&tk=28228DE7FA07D013677756DD94686DEA&_=${new Date().getTime()}`
}
let tasks = new class{
    constructor() {
        this.tasks = [];
    }
    next() {
        if (this.tasks.length) {
            this.tasks.pop()();
        } else {
            console.log(`全部完成`);
            //process.exit(0);
        }
    }
    init() {
        let $this = this;
        codes.forEach(code => {
            $this.tasks.push(doit.bind(null,code));
        });
    }
}

function doit(code) {
    get(url(code.f12))
        .then(rec => {
            rec = rec.trim();
            if (rec.startsWith('cb(')) {
                rec = rec.substring('cb('.length,rec.length - 1);
                console.log(`${code.f14} 获取成功，正在保存`);
                post(`http://localhost:8484/api`,{
                    method: 'post',
                },JSON.stringify({
                    method: 'insert',
                    content: JSON.stringify({
                        id: code.f12,
                        name: code.f14,
                        content: rec,
                        time: time,
                    })
                })).then(ok => {
                    console.log(`${code.f14} 保存成功`);
                    tasks.next();
                })
                    .catch(console.log);
            } else {
                console.log(`${code.f14} 没有数据`);
                tasks.next();
            }
        }).catch(console.log);
}
setTimeout(() => {
    tasks.init();
    tasks.next();
},1000);

var cmd = `"${path.join(currentPath,'DbService.exe')}" 8484 "${path.join(currentPath,'db.db')}"`;
console.log(cmd);

exec(cmd, function(error, stdout, stderr) {
    // 获取命令执行的输出
    // stdout.on('data', (data) => {
    //     console.log(`stdout: ${data}`);
    // });
    // stderr.on('data', (data) => {
    //     console.log(`stdout: ${data}`);
    // });
    // console.log(error)
});