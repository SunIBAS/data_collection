// 雪球提供 https://xueqiu.com/hq/screener
const {get} = require('./../../_utils/Ajax');
const fs = require('fs');

let task = [];

function url(page) {
    return `https://xueqiu.com/service/screener/screen?category=CN&exchange=sh_sz&areacode=&indcode=&order_by=symbol&order=desc&page=${page}&size=30&only_count=0&current=&pct=&mc=&volume=&_=${new Date().getTime()}`;
}

let all = [];
for (let i = 0;i < 134;i++) {
    task.push((function (page) {
        get(url(page)).then(_ => {
            _ = JSON.parse(_);
            all = all.concat(_.data.list);
            console.log(`${task.length} / 134`);
            if (task.length) {
                setTimeout(function () {
                    task.pop()();
                },200);
            } else {
                fs.writeFileSync('所有股票代码.json',JSON.stringify(all),'utf-8');
            }
        });
    }).bind(null,i + 1));
}
task.pop()();