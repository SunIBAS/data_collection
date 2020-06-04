const gold = require('./gold.sort.json');
const {
    getFromDay
} = require('./../../_utils/getDays');
let ds = [];
let gfd = getFromDay(2004,9,1,'yyyy/MM/dd',true,2020,3,13);
const fs = require('fs');

let goldInd = 0;
let d;
for (let i = 0;i < gold.length;i++) {
    d = gfd();
    if (d) {
        if (d !== gold[i].day) {
            ds.push(d);
            i--;
        }
    } else {
        break;
    }
}
console.log(ds.length);
fs.writeFileSync('od.json',JSON.stringify(ds),'utf-8');