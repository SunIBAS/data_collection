const fs = require('fs');
const tmpPath = "d:\\temp\\";

// fs.readdirSync('./').filter(_ => _.endsWith('-province.json')).forEach(_ => {
//     let t = fs.readFileSync(_,'utf-8');
//     let c = 0;
//     t = t.replace(/[0-9]+:/g,a => {
//         c++;
//         return '"' + a.substring(0,a.indexOf(':')) + '":';
//     });
//     console.log(`reset count ${c}`);
//     t = JSON.stringify(JSON.parse(t + '}'));
//     fs.writeFileSync(tmpPath + _,t,'utf-8');
// });

fs.readdirSync(tmpPath).filter(_ => _.endsWith('-province.json')).forEach(_ => {
    console.log(`filename ${_}`);
    let t = require(tmpPath + _);
    // JSON.parse(t);
});