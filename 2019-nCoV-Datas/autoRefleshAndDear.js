const http = require('http');
const fs = require("fs");
const spawn = eval('require')('child_process').spawn;
const _json = require('./source/_forAuto/_json');
const _dcsv = require('./source/_forAuto/_dearCsv');
const _djson = require('./source/_forAuto/_dearJson');

// 不重复下载也不重复处理
const norepeat = true;
const url = {
    info : "http://www.sunibas.cn/ill/info",
    down: "http://www.sunibas.cn/ill/down?filename="
};

const downDir = {
    csv: 'source\\csvFile\\',
    json: 'source\\jsonFile\\'
};
const myFetch = (url) => {
    return new Promise(function (succ,fail) {
        http.get(url,(resp) => {
            let data = '';
            resp.on('data',(chunk) => {
                data += chunk.toString();
            });
            resp.on('end',() => {
                succ(data);
            });
            resp.on("error",err => {
                fail(err);
            });
        });
    });
};
const downFile = (url) => {
    return new Promise(function (succ,fail) {
        http.get(url,(resp) => {
            let data = [];
            resp.on('data',(chunk) => {
                data.push(chunk);
            });
            resp.on('end',() => {
                succ(data);
            });
            resp.on("error",err => {
                fail(err);
            });
        });
    });
};
function toDownFile(fileName,type,cb) {
    console.log(`to download file >>> ${fileName}`);
    downFile(url.down + fileName)
        .then(data => {
            let ws = fs.createWriteStream(downDir[type] + fileName);
            data.forEach(ws.write.bind(ws));
            ws.end();
            // fs.writeFileSync(downDir[type] + fileName,data,'utf-8');
        })
        .then(cb);
}

const toUpdateFile = () => {
    let allTask = (function () {
        let task = 0;
        let filenames = [];
        return {
            add(filename) {
                task++;
                filenames.push(filename);
            },
            cut() {
                task--;
            },
            check(cb) {
                let id = setInterval(() => {
                    if (task) {
                    } else {
                        clearInterval(id);
                        cb();
                    }
                },200);
            }
        };
    })();
    myFetch(url.info)
        .then(JSON.parse)
        .then(data => {
            let toDown = true;
            for (let i in data.csv) {
                toDown = true;
                if (norepeat && fs.existsSync(downDir.csv + data.csv[i])) {
                    toDown = false;
                }
                if (toDown) {
                    allTask.add();
                    toDownFile.bind(null,data.csv[i])('csv',allTask.cut.bind(allTask));
                }
            }
            for (let i in data.json) {
                toDown = true;
                if (norepeat && fs.existsSync(downDir.json + data.json[i])) {
                    toDown = false;
                }
                if (toDown) {
                    allTask.add();
                    toDownFile.bind(null,data.json[i])('json',allTask.cut.bind(allTask));
                }
            }
            allTask.check(dearFiles);
        });
};

const basePath = process.cwd();

const lastTask = () => {
    let fn = function(filename) {
        spawn(`converter.exe ${filename}`, {
            shell: true,
        });
    };
    fs.readdirSync('data_json')
        .filter(_ => _.endsWith('.json'))
        .forEach(json => {
            fn('data_json\\' + json);
        });
    fs.readdirSync('datas')
        .filter(_ => _.endsWith('.txt'))
        .forEach(json => {
            fn('datas\\' + json);
        });
};

const dearFiles = () => {
    _djson(basePath,norepeat,function () {
        _json(basePath,norepeat,function () {
            console.log("完成");
            // console.log("开始转化文件");
            // lastTask();
            // console.log("文件转化完成");
        });
    })
};

toUpdateFile();