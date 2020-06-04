let kv = {
    "27": "人民币钯",
    "28": "美元钯(钞)",
    "29": "美元钯(汇)",
    "21": "人民币银",
    "22": "人民币铂",
    "15": "美元金(钞)",
    "17": "美元银(钞)",
    "19": "美元铂(钞)",
    "16": "美元金(汇)",
    "18": "美元银(汇)",
    "20": "美元铂(汇)",
    "01": "AU9999",
    "02": "AU9995"
};
let fs = require('fs');
let p = require('./config');
let tarPath = p.savePath;
let tarPathRet = p.resultPath;

let CheckFileAndCreate = function(path,defaultContent) {
    if (fs.existsSync(path)) {} else {
        fs.writeFileSync(path,defaultContent || "",'utf-8');
    }
};

// setInterval(function () {
    let temp = {};
    fs.readdirSync(tarPath)
        .sort((a,b) => {
            let aa = a.split('.json')[0].replace(/[-_. ]/g,'');
            let bb = b.split('.json')[0].replace(/[-_. ]/g,'');
            // return parseInt(aa) - parseInt(bb);
            return aa - bb;
        })
        .forEach(f => {
            try {
                let dd = require(tarPath + f).PMAccGld_Bss_Prc_List;
                dd.forEach(d => {
                    let date = d.Tms.split(' ')[0]; // 日期
                    let targetFile = tarPathRet + kv[d.PM_Txn_Vrty_Cd] + "_" + date + '.json';
                    if (targetFile in temp) {} else {
                        CheckFileAndCreate(targetFile,'[]');
                        temp[targetFile] = require(targetFile);
                    }
                    temp[targetFile].push({
                        t: d.Tms,
                        in: d.Cst_Buy_Prc,
                        out: d.Cst_Sell_Prc
                    });
                });
                delete require.cache[require.resolve(tarPath + f)];
            } catch (e) {
                console.log(e.message);
            } finally {
                fs.unlinkSync(tarPath + f);
            }
        });
    for (let i in temp) {
        fs.writeFileSync(i,JSON.stringify(temp[i]),'utf-8');
        delete require.cache[i];
        delete temp[i];
    };
// },60 * 1000);
console.log('over');