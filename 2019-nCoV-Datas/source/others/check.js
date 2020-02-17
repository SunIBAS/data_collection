const fs = require("fs");
const cityCode = require("./cityCode.json").name2Code;

fs.readFileSync("./../../datas/2020-02-05.txt",'utf-8')
    .split(/[\r\n]/)
    .filter(_ => _)
    .map(_ => _.split(',')[1])
    .forEach(name => {
        if (name in cityCode) {} else {
            console.log(name);
        }
    });
