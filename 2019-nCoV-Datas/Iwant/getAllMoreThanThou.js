const fs = require('fs');
// 格式化时间的[月]和[日]
(() => {
    let zeros = [0,0,0,0,0,0,0,0];

    let changeZeroLength = function(deta) {
        if (zeros.length < deta) {
            for (;deta > zeros.length;deta--) {
                zeros.push(0);
            }
        }
    };
    Number.prototype.toLength = function (len) {
        return (this + '').toLength(len);
    };
    String.prototype.toLength = function (len) {
        let n = this;
        if (n.length < len) {
            let deta = len - (n + '').length;
            changeZeroLength(deta);
            return zeros.slice(0,deta).join('') + n;
        } else {
            return n;
        }
    };
})();
const date = (() => {
    let d = new Date();
    console.log(d);
    d.setTime(d.getTime() - 3600 * 24 * 1000);
    console.log(d.getDate());
    console.log(d.getDate().toLength(2));
    return (d.getYear() + 1900) + '-' + (d.getMonth() + 1).toLength(2) + '-' + (d.getDate()).toLength(2);
})();

const basePath = (() => {
    const b = "2019-nCoV-Datas";
    const p = process.cwd();
    return p.substring(0,p.indexOf(b) + b.length);
})();
console.log(basePath + "\\data_json\\" + date + ".json");
const json = require(basePath + "\\data_json\\" + date + ".json");
let out = {
    "中国": "000000",
    "武汉": "420100",
    "广州": "440100",
    "深圳": "440300",
};
for (let i in json) {
    if (i.substring(2) === "0000" && i !== "000000") {
        if (parseInt(json[i][2]) > 1000) {
            out[json[i][1]] = json[i][0];
        }
    }
}
if ("安徽省" in out) {} else {
    out['安徽省'] = 340000;
}
if ("北京市" in out) {} else {
    out['北京市'] = 110000;
}
if ("上海市" in out) {} else {
    out['上海市'] = 310000;
}
if ("湖南省" in out) {} else {
    out['湖南省'] = 430000;
}
fs.writeFileSync('./iwant.json',JSON.stringify(out),'utf-8');