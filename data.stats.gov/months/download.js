const {
    run
} = require('./../_common/download');
const treeNode = require('./treeNode');

const path = `C:\\\\Users\\\\HUZENGYUN\\\\Documents\\\\git\\\\文档\\\\data_collection\\\\data.stats.gov\\\\months\\\\datas\\\\`;

run(treeNode,path,'app.asar/preload.js');
