const {
    NumberNext
} = require('./../../_utils/ObjectToNext');
const {
    get
} = require('./../../_utils/Ajax');
const fs = require('fs');
const savePath = "E:\\xiaomi\\";

let url = n => {
    return `https://m.jr.mi.com/api/product/chartInfo?prodCode=GOLD001&start=${n}&limit=10&clientEnv=Browser&serviceEnv=production&platformOS=Browser&from=licai_hjicon_7&referId=intro&currentId=intro_income`
};

let nn = NumberNext(1,61);

function doIt() {
    let n = nn.next();
    if (n) {
        get(url(n))
            .then(_ => {
                fs.writeFileSync(savePath + n + '.json',_,'utf-8');
                doIt();
            });
    } else {
        console.log("all done");
    }
}
doIt();
