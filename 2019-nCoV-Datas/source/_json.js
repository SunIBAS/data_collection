const fs = require("fs");
const dir = "./../datas";
fs.readdirSync(dir)
    .filter(_ => _.endsWith(".txt"))
    .forEach(file => {
        // let file = "2020-01-19.txt";
        let json = {};
        ret = fs.readFileSync(dir + "/" + file,'utf-8')
            .split(/[\r\n]/)
            .map(_ => _.split(','))
            .filter(_ => _.length > 2);
            ret.forEach((line,ind) => {
                if (ind && line.length) {
                    json[line[0]] = line;
                }
            });
        fs.writeFileSync('./../data_json/' + file.replace('.txt','.json'),JSON.stringify(json),'utf-8');
    });
