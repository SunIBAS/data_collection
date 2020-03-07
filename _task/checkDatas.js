const path = require('path');
const fs = require('fs');
const {
    deleteRequire
} = require('./../_utils/requireOP');
const {
    DaysAgoBegin,
    getToday
} = require('./../_utils/getDays');
const basePath = require('./../_utils/basePath');

function checkQianxiBaidu() {
    let path1 = day => [
        basePath.qianxiBaiduAdd(`/迁入地数据/${day}-city.json`),
        basePath.qianxiBaiduAdd(`/迁入地数据/${day}-province.json`)
    ];
    let path2 = day => [
        basePath.qianxiBaiduAdd(`/迁出地数据/${day}-city.json`),
        basePath.qianxiBaiduAdd(`/迁出地数据/${day}-province.json`)
    ];
    let path3 = day => [
        basePath.qianxiBaiduAdd(`/迁徙趋势/move_in-${day}.json`),
        basePath.qianxiBaiduAdd(`/迁徙趋势/move_out-${day}.json`),
    ];
    let path4 = day => basePath.qianxiBaiduAdd(`/城内出行强度/${day}.json`);
    // 检查下载内容是否完成无误
    let eachFileDo = function (f) {
        if (fs.existsSync(f)) {
            console.log(`check file ${f}`);
            let d = require(f);
            for (let i in d) {
                if ((d[i].errno + '') !== "0") {
                    console.log(`${i} have error,error is ${d[i].errno}`);
                }
            }
            deleteRequire(f);
        }
    };
    let nd = DaysAgoBegin(2);
    let ndd;
    while (ndd = nd()) {
        path1(ndd).forEach(eachFileDo);
        path2(ndd).forEach(eachFileDo);
        path3(ndd).forEach(eachFileDo);
    }

    // 将 迁徙趋势 数据格式化好
    path3(getToday()).forEach(f => {
        let haveError = false;
        if (!fs.existsSync(f)) {
            return;
        }
        let isMoveIn = true;
        let compareFileStr = '';
        if (f.indexOf("move_in") !== -1) {
            isMoveIn = true;
        } else if (f.indexOf("move_out") !== -1) {
            isMoveIn = false;
        } else {
            haveError = true;
            throw Error(`I don't know moveIn or moveOut : ${f}`);
        }
        compareFileStr =
            basePath.qianxiBaiduAdd(
                `/迁徙趋势/${isMoveIn ? 'moveIn':'moveOut'}.json`);

        console.log(`check and merge file`);
        console.log(`\t\t${f}`);
        console.log(`\t\t${compareFileStr}`);

        console.log(`Compare file :\n\t${f}\n\t\tand\n\t${compareFileStr}`);
        let tFile = require(f); // 今天的数据
        let pFile = require(compareFileStr); // 昨天的数据
        for (let i in pFile) {
            if (i in tFile) {
                for (let j in tFile[i].data.list) {
                    // todo
                    if (j in pFile[i].data.list) {
                        if (tFile[i].data.list[j] === pFile[i].data.list[j]) {

                        } else {
                            haveError = true;
                            console.log(`data ${i} in ${j} is diff`);
                        }
                    } else {
                        pFile[i].data.list[j] = tFile[i].data.list[j];
                    }
                }
            } else {
                haveError = true;
                console.log(`${i} is not in today file`)
            }
        }
        if (!haveError) {
            fs.writeFileSync(compareFileStr,JSON.stringify(pFile),'utf-8');
            fs.unlinkSync(f);
        }
    });
    (function () {
        // return ;
        let haveError = false;
        // 获取今日份的文件
        let tp4file = path4(getToday());
        // 获取历史文件
        let pp4file = basePath.qianxiBaiduAdd(`/城内出行强度/out.json`);
        let tp4 = require(tp4file);
        let pp4 = require(pp4file);
        console.log(`check and merge file`);
        console.log(`\t\t${tp4file}`);
        console.log(`\t\t${pp4file}`);
        for (let i in tp4) {
            if ((tp4[i].errno + '') !== '0') {
                if ((pp4[i].errno + '') !== '0') {
                    console.log(`both file ${i} errno is not zero`);
                } else {
                    haveError = true;
                    console.log(`[sss] : today file ${i} errno is not zero`);
                }
            } else {
                if ((pp4[i].errno + '') !== 0) {
                    pp4[i] = tp4[i];
                } else {
                    for (let j in tp4[i].data.list) {
                        if (j in pp4[i].data.list) {} else {
                            pp4[i].data.list[j] = tp4[i].data.list[j];
                        }
                    }
                }
            }
        }
        fs.writeFileSync(pp4file,JSON.stringify(pp4),'utf-8');
        if (!haveError) {
            fs.unlinkSync(tp4file);
        }
    })();
}
checkQianxiBaidu();