const {
    getString,
} = require('./../../_utils/Ajax');
const {
    ArrayToNext
} = require('./../../_utils/ObjectToNext');
const fs = require('fs');
const baseUrl = 'http://data.stats.gov.cn/easyquery.htm?';

let arr = ArrayToNext(require('./treeNode.json'));
let curOne = "";
let getReqParam = (obj,h1) => {
    let o = h1 ? {
        h: '1'
    } : {};
    return {
        ...o,
        m: 'QueryData',
        dbcode: 'hgyd',
        rowcode: 'zb',
        colcode: 'sj',
        wds: '[]',
        dfwds: `[{"wdcode":"${obj.wdcode}","valuecode":"${obj.id}"}]`,
        k1: (new Date()).getTime()
    }
};
let out = [];
function down() {
    curOne = arr.next();
    if (curOne) {
        out.push({
            url: baseUrl + getString(getReqParam(curOne,true)),
            id: null
        });
        out.push({
            url: baseUrl + getString(getReqParam({
                wdcode: 'sj',
                id: "LAST122"
            })),
            id: curOne.id
        });
        down();
    } else {
        console.log('done');
        fs.writeFileSync('app.asar/preload.js',
            `let fs = require('fs');
let url = ${JSON.stringify(out)};
window.onload = function () {
    document.body.innerHTML = \`<style>
* {
    border: none;
    margin: 0;
    padding: 0;
}
</style><div style="height: 50px;">
<button onclick="next()">next</button>
</div>
<iframe style="border: 1px solid red;width: calc(100vw - 20px);height: calc(100vh - 60px);"
         id="ifr" src=""  disablewebsecurity></iframe>\`;
    setTimeout(function () {
        console.clear();
        document.getElementById('ifr').onload = function () {
            if (i % 2) {
                let j = (JSON.parse(ifr.contentDocument.body.innerText));
                saveFile.bind(null,j,url[i].id)();
                setTimeout(function () {
                    next();
                },300);
            } else {
                setTimeout(function () {
                    if (i >= url.length) {
                        alert('结束');
                    } else {
                        next();
                    }
                },300)
            }
        }
    });
};
window.i = 0;
window.next = function() {
    document.getElementById('ifr').src = url[i++].url;
};
window.saveFile = function (obj,filename) {
    console.log(\`save file \${filename}\`);
    fs.writeFileSync(
        'C:\\\\Users\\\\HUZENGYUN\\\\Documents\\\\git\\\\文档\\\\data_collection\\\\data.stats.gov\\\\monts\\\\datas\\\\' + filename + '.json',
        JSON.stringify(obj),'utf-8');
};`,'utf-8');
    }
}

down();

