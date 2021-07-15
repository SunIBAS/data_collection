const fs = require('fs');
const path = require('path');
const {
    qianxiBaiduAdd,     // 合并地址
    tempPath            // 临时地址
} = require('./../_utils/basePath');

let 合并日期 = "20210629";

let col = {
    迁入省: {
        files: [],
        dir: '迁入地数据',
        filename: `${合并日期}-province.json`,
    },
    迁入市: {
        files: [],
        dir: '迁入地数据',
        filename: `${合并日期}-city.json`,
    },
    迁出省: {
        files: [],
        dir: '迁出地数据',
        filename: `${合并日期}-province.json`,
    },
    迁出市: {
        files: [],
        dir: '迁出地数据',
        filename: `${合并日期}-city.json`,
    },
};

fs.readdirSync(tempPath)
    .filter(fname => fname.startsWith(合并日期))
    .forEach(file => {
        if (file.endsWith('city-move-out.json')) {
            col.迁出市.files.push(file);
        } else if (file.endsWith('city-move-in.json')) {
            col.迁入市.files.push(file);
        } else if (file.endsWith('province-move-out.json')) {
            col.迁出省.files.push(file);
        } else if (file.endsWith('province-move-in.json')) {
            col.迁入省.files.push(file);
        }
    });

for (let i in col) {
    let datas = {};
    col[i].files.forEach(f => {
        let id = f.split('-')[1];
        // try {
            datas[id] = JSON.parse(fs.readFileSync(path.join(tempPath,f),'utf-8').substring(1))
        // } catch (e) {
        //     debugger
        //     console.log(e);
        // };
    });
    fs.writeFileSync(qianxiBaiduAdd(col[i].dir + "\\" + col[i].filename),JSON.stringify(datas));
}

