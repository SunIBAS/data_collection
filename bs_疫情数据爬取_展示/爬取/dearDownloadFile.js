const fs = require('fs');

let txt = fs.readFileSync('./nav.txt','utf-8');
txt = txt.replace(/document\.writeln\("[ \t]+/g,'');
let txtSp = txt.split('\r\n');
let i = 0;
for (;i < txtSp.length;i++) {
    if (txtSp[i] === 'document.writeln("");') {
        break;
    }
}

const getLinkAndName = str => {
    console.log(str);
    // 匹配汉字
    let name = str.match(/[\u4e00-\u9fa5]+/);
    if (name) {
        name = name[0];
    } else {
        return null;
    }
    //
    let link = str.match(/href=\\'[a-zA-Z?.=\/0-9]+/)[0].substring(7);
    return {name,link};
}

let citys = [];
for (;i < txtSp.length;i += 10) {
    // pName = `<li><a href=\\'/covid/list.asp?id=439\\'><b>湖北</b></a></li>`;
    let pName = getLinkAndName(txtSp[i + 9].split('"')[0]);
    if (!pName) {
        break;
    }
    pName.children = [];
    // arr = [`<li><a href=\'/covid/list.asp?id=422\'>仙桃</a>`]
    txtSp[i + 10].split('</li>').map(str => {
        if (str.length > 10) {
            pName.children.push(getLinkAndName(str));
        }
    });
    citys.push(pName);
}

console.log(citys);
