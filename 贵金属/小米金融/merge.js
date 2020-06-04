const fs = require('fs');
const savePath = "E:\\xiaomi\\";

let out = [];

fs.readdirSync(savePath)
.filter(_ => _.endsWith('.json'))
.forEach(_ => {
    let q = require(savePath + _);
    q.data.valueList.forEach(d => {
        out.push({
            date: d.v1,
            value: d.v3
        });
    })
});

out = out.sort((a,b) => {
    return a.date.replace(/-/g,'') - b.date.replace(/-/g,'');
});

fs.writeFileSync('gold.json',JSON.stringify(out),'utf-8');