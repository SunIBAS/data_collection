// 转化为 sql
const fs = require('fs');
const codes = require('./../stock/datas/all.json');
const jc = require('./所有基金持仓情况.json');

// 先填写股票名字
let codeMap = {};
codes.forEach(cs => {
    cs.datas.forEach(c => {
        codeMap[c.f12] = c.f14;
    });
});

// let a = [
//     {
//         "index": "1",
//         "code": "",
//         "name": "",
//         "start_have": "0",
//         "end_have": "0",
//         "change_have": "0",
//         "start_get": "0",
//         "end_get": "0",
//         "change_get": "0",
//         "start_percent": "0",
//         "end_percent": "0",
//         "change_percent": "0",
//         "foundCode": "968074"
//     }
// ];

let formatInsert = (obj,ind) => {
    return `INSERT INTO "main"."found"("id", "code", "name", "start_have", "end_have", "change_get", "start_percent", "end_percend", "change_percend", "foundCode") VALUES ('${ind}', '${obj.code}', '${obj.name}', ${obj.start_have}, ${obj.end_have}, ${obj.change_get}, ${obj.start_percent}, ${obj.end_percent}, ${obj.change_percent}, '${obj.foundCode}');`;
};
let sqls = [];
jc.forEach((j,ind) => {
    j.name = codeMap[j.code];
    j.name = j.name || "未知" + ind;
    sqls.push(formatInsert(j,ind));
});

fs.writeFileSync('insert.sql',sqls.join('\r\n'),'utf-8');

