// 603335 5.1~5.3
// 002915 19~20

// date,start,end,max,min,hand
const sz = require('./SZ002915.json');
const Dear = require('./Dear');

let d = new Dear(20,21,10,100 * 1000);
let fromYear = 2019;

sz.forEach(s => {
    if (+ s[0].substring(0,4) < fromYear) {
        return;
    }
    let min = Math.min(+s[1],+s[2],+s[4]);
    let max = Math.max(+s[1],+s[2],+s[3]);

    if (s[0] === '2020-07-24') {
        console.log("")
    }
    d.buyIn(min,s[0]);
    d.sealAll(max,s[0]);
});

console.log(d.buy)
console.log(d.seal)
console.log(d.buyHand)
d.show();
d.writeOutBuySeal(sz,fromYear);