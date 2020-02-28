const {
    run
} = require('./../_common/getTree');
const fs = require('fs');

run(function (obj) {
    fs.writeFileSync("treeNode.json",JSON.stringify(obj),'utf-8');
},{
    id: "zb",
    dbcode: "hgyd",
    "isParent":true,
    wdcode: "zb",
    name: "指标",
    "pid":"",
});
