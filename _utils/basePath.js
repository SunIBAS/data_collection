const path = require('path');

let basePath = (() => {
    let projectName = "data_collection";
    let cwd = process.cwd();
    return cwd.substring(0,cwd.indexOf(projectName) + projectName.length);
})();

module.exports = {
    tempPath: "g:\\temp",
    'root': basePath,
    'rootAdd'(subPath) { return path.join(basePath,subPath) },
    '2019nCovDatas': path.join(basePath,'2019-nCov-Datas'),
    '2019nCovDatasAdd' (subPath) {
        return path.join(basePath,'2019-nCov-Datas',subPath)
    },
    'qianxiBaidu': path.join(basePath,'qianxi.baidu'),
    'qianxiBaiduAdd'(subPath) {
        return path.join(basePath,'qianxi.baidu',subPath)
    },
};