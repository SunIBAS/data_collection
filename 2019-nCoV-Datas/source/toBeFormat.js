// 目的是让每个文件都有省的信息
const fs = require("fs");
const {
    code2Province,
    code2Name
} = require('./others/cityCode.json');
const only = [
    '2020-02-01.txt',
    '2020-02-02.txt',
    '2020-02-03.txt',
];
function toBeFormat(basePath,cb) {
    const dir = basePath + "/datas";
    cb = cb || (() => {});
    fs.readdirSync(dir)
        .filter(_ => _.endsWith(".txt"))
        .filter(_ => only.indexOf(_) !== -1)
        .forEach(file => {
            // let file = "2020-02-09.txt";
            let json = [];
            let curLine = [];
            let curSub = "";
            let toKeep = false;
            fs.readFileSync(dir + "/" + file,'utf-8')
                .split(/[\r\n]/)
                .map(_ => _.split(','))
                .filter(_ => _.length > 1)
                .sort((a,b) => parseInt(a) - parseInt(b))
                .forEach((line,ind) => {
                    if (!ind) {
                        json.push(line);
                    } else {
                        if (line[0] === '-1' ||
                            line[0] === '000000' ||
                            line[0] === "999999") {
                            //line[0] = '-1';
                            json.push(line);
                        } else if (line[0].substring(2) === "0000") {
                            curSub = line[0].substring(0,2);
                            if (toKeep) {
                                json.push(curLine);
                            }
                            json.push(line);
                            toKeep = false;
                        } else {
                            if (line[0].substring(0,2) === curSub) {
                                json.push(line);
                                if (toKeep) {
                                    curLine[2] += parseInt(line[2]);
                                    curLine[2] += parseInt(line[3]);
                                    curLine[2] += parseInt(line[4]);
                                    curLine[2] += parseInt(line[5]);
                                }
                            } else {
                                if (toKeep) {
                                    json.push(curLine);
                                }
                                toKeep = true;
                                json.push(line);
                                curLine = [];
                                curLine[0] = line[0].substring(0,2) + "0000";
                                curLine[1] = code2Province[curLine[0]];
                                curLine[2] = parseInt(line[2]);
                                curLine[3] = parseInt(line[3]);
                                curLine[4] = parseInt(line[4]);
                                curLine[5] = parseInt(line[5]);
                                curSub = line[0].substring(0,2);
                            }
                        }
                    }
                });

            if (toKeep) {
                json.push(curLine);
            }
            json = json.sort((a,b) => parseInt(a) - parseInt(b));
            let json2 = [];
            curLine = [];
            curSub = "";
            toKeep = false;
            json.forEach((line,ind) => {
                if (!ind) {
                    json2.push(line);
                } else {
                    if (line[0] === '-1' ||
                        line[0] === "999999" ||
                        line[0] === '000000' ||
                        line[0].substring(2) === "0000" ||
                        line[0].substring(0,2) === "11" ||  // 北京
                        line[0].substring(0,2) === "12" ||  // 天津
                        line[0].substring(0,2) === "50" ||  // 重庆
                        line[0].substring(0,2) === "31"     // 上海
                    ) {
                        //line[0] = '-1';
                        json2.push(line);
                    } else if (line[0].substring(4) === "00") {
                        curSub = line[0].substring(0,4);
                        if (toKeep) {
                            json2.push(curLine);
                        }
                        json2.push(line);
                        toKeep = false;
                    } else {
                        if (line[0].substring(0,4) === curSub) {
                            json2.push(line);
                            if (toKeep) {
                                curLine[2] += parseInt(line[2]);
                                curLine[2] += parseInt(line[3]);
                                curLine[2] += parseInt(line[4]);
                                curLine[2] += parseInt(line[5]);
                            }
                        } else {
                            if (toKeep) {
                                json2.push(curLine);
                            }
                            toKeep = true;
                            json2.push(line);
                            curLine = [];
                            curLine[0] = line[0].substring(0,4) + "00";
                            curLine[1] = code2Name[line[0].substring(0,2) + "0000"][curLine[0]];
                            curLine[2] = parseInt(line[2]);
                            curLine[3] = parseInt(line[3]);
                            curLine[4] = parseInt(line[4]);
                            curLine[5] = parseInt(line[5]);
                            curSub = line[0].substring(0,2);
                        }
                    }
                }
            });
            if (toKeep) {
                json2.push(curLine);
            }
            json2 = json2.sort((a,b) => parseInt(a) - parseInt(b))
                .filter(_ => _[1]);
            json = [];
            curLine = ["000000","全国",0,0,0,0];
            json2.forEach((line,ind) => {
                if (!ind) {
                    json.push(line);
                } else if (line[0] === "000000") {
                    curLine[3] = line[3];
                    curLine[4] = line[4];
                    curLine[5] = line[5];
                } else {
                    if (line[0].substring(2) === "0000") {
                        curLine[2] += parseInt(line[2] || 0);
                        json.push(line);
                    } else {
                        json.push(line);
                    }
                }
            });
            json.push(curLine);
            console.log(curLine);
            fs.writeFileSync(basePath + '/datas/' + file,
                json.map(_=>_.join(',')).join('\r\n'),'utf-8');
        });
    cb();
}

toBeFormat((() => {
    const b = "2019-nCoV-Datas";
    const p = process.cwd();
    return p.substring(0,p.indexOf(b) + b.length);
})());
