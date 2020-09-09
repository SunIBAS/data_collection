let names = ['沪深A','上证A','深证A','新股','中小板','创业板','科创板','沪股通','B股','上证AB股比价','深证AB股比价','风险警示板','两网及退市'];
const fs = require('fs');

let all = [];
names.forEach((n,ind) => {
    all.push({
        name: n,
        index: ind,
        datas: require(`./datas/${n}.json`)
    });
});

fs.writeFileSync('./datas/all.json',JSON.stringify(all),'utf-8');