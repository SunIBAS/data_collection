const fs = require("fs");
function doJson(basePath,norepeat,cb) {
    const dir = basePath + "/datas";
    cb = cb || (() => {});
    fs.readdirSync(dir)
        .filter(_ => _.endsWith(".txt"))
        .forEach(file => {
            let json = {};
            if (norepeat) {
                if (fs.existsSync(basePath + '/data_json/' + file.replace('.txt','.json'))) {
                    return;
                }
            }
            console.log("start to dear with file => " + file);
            fs.readFileSync(dir + "/" + file,'utf-8')
                .split(/[\r\n]/)
                .map(_ => _.split(','))
                .forEach((line,ind) => {
                    if (ind && line.length) {
                        json[line[0]] = line;
                    }
                });
            fs.writeFileSync(basePath + '/data_json/' + file.replace('.txt','.json'),JSON.stringify(json),'utf-8');
        });
    cb();
}

module.exports = doJson;
