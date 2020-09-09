let names = ['沪深A','上证A','深证A','新股','中小板','创业板','科创板','沪股通','B股','上证AB股比价','深证AB股比价','风险警示板','两网及退市'];
const fs = require('fs');

let keys = {};
let all = [];
let insertOrUpdate = "";
names.forEach((n,ind) => {
    let data = require(`./datas/${n}.json`);
    // = [{"f12":"688379","f14":"N华光"}]
    data.forEach(d => {
        if (d.f12 in keys) {} else {
            all.push({
                code: d.f12,
                name: d.f14
            });
            insertOrUpdate += "INSERT INTO `tmp`.`stock`(`id`, `name`) VALUES ('" + d.f12 + "','" + d.f14.replace(/ /g,'') + "');\r\n"
            keys[d.f12] = '';
        }
    });
});
console.log('total is ' + all.length);
fs.writeFileSync('./datas/unique.json',JSON.stringify(all),'utf-8');
fs.writeFileSync('./datas/insert.sql',insertOrUpdate,'utf-8');

