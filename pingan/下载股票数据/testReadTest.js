const fs = require('fs');

let dates = {};
require('./all/000004.json').klines.map(_ => _.split(',')[0]).forEach(d => {
    let y = +d.substring(0,4);
    if (y in dates) {} else {
        dates[y] = 0;
    }
    dates[y]++;
});
console.log(JSON.stringify(dates,'','\t'))

