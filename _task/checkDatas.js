const path = require('path');
const fs = require('fs');
const {
    deleteRequire
} = require('./../_utils/requireOP');
const basePath = require('./../_utils/basePath');

function checkQianxiBaidu() {
    let path1 = basePath.qianxiBaiduAdd('/迁入地数据');
    let path2 = basePath.qianxiBaiduAdd('/迁出地数据');
    let path3 = basePath.qianxiBaiduAdd('/迁徙趋势');
    fs.readdirSync(path1)
        .filter(_ => _.endsWith('.json'))
        .forEach(_ => {
            let fp = path.join(path1,_);
            require(fp);
            deleteRequire(fp);
        });
    fs.readdirSync(path2)
        .filter(_ => _.endsWith('.json'))
        .forEach(_ => {
            let fp = path.join(path2,_);
            require(fp);
            deleteRequire(fp);
        });
    fs.readdirSync(path3)
        .filter(_ => _.endsWith('.json'))
        .forEach(_ => {
            let fp = path.join(path3,_);
            require(fp);
            deleteRequire(fp);
        });
}
checkQianxiBaidu();