let gold = require('./gold.all.json');
const fs = require('fs');

gold = gold.sort((a,b) => {
    return a.date - b.date;
});

// let out = [gold[0]];
// for (let i = 1;i < gold.length;i++) {
//     if (gold[i].date !== gold[i - 1].date) {
//         out.push(gold[i]);
//     }
// }

fs.writeFileSync('gold.all.sort.json',JSON.stringify(gold),'utf-8');