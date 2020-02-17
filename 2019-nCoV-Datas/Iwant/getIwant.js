const fs = require('fs');
const spawn = eval('require')('child_process').spawn;
let allWant = require('./iwant.json');
const basePath = (() => {
    const b = "2019-nCoV-Datas";
    const p = process.cwd();
    return p.substring(0,p.indexOf(b) + b.length);
})();
const pointLength = 3; // 保留小数点几位
const toPersent = true; // 转成百分比
const forceGetNumber = (d) => {
    if (d) {
        if (d === '-') {
            return 0;
        } else {
            let n = parseInt(d);
            if (Number.isNaN(n)) {
                return 0;
            } else {
                return n;
            }
        }
    } else {
        return 0;
    }
};
// 原本的格式是 yyyy-mm-dd
const timeFormat = (d) => {
    return d.replace(/[-]/g,'');
};
const labels = {
    "确诊"(d) { return forceGetNumber(d[2]); },
    "疑似"(d) { return forceGetNumber(d[3]); },
    "治愈"(d) { return forceGetNumber(d[4]); },
    "死亡"(d) { return forceGetNumber(d[5]); },
    "死亡率"(d) { return (d[2] || 0) ? ((d[5] || 0) / d[2]  * (toPersent ? 100 : 1)).toFixed(pointLength - (toPersent ? 2 : 0)) : 0 ; },
};
const detaLabel = {
    /**
     * @param data 是所有结果数据
     * @param ind 是该label的位置
     * */
    "新增确诊"(data,ind) {
        // 记住，计算递增时，第一行没法计算
        // 另外是每行数据的第一个值是时间
        // 获取确诊的位置
        let qzInd = (() => {
            let ind = -1;
            outLabel.some((_,_ind) => {
                if (_ === "确诊") {
                    ind = _ind;
                    return true;
                } else {
                    return false;
                }
            });
            return ind;
        })();
        if (qzInd === -1) {
            throw new Error("没有确诊信息，没法算");
        }
        for (let i = 1;i < data.length;i++) {
            // 这一行的新增等于这一行减上一行的确诊
            // 0 1 x 1 x
            for (let j = 1;j < data[i].length;j+=outLabel.length) {
                data[i][j + ind] = data[i][j + qzInd] - data[i - 1][j + qzInd];
            }
        }
        return data;
    }
};
const outLabel = ["确诊","新增确诊","治愈","死亡","疑似"]; //, "死亡率", '死亡', '疑似'];
let code = require(basePath + '/source/others/cityCode.json');
let out = [];
let tmp;
let d = new Date();
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
// 将数据存储到 out 中
fs.readdirSync(basePath + "/data_json")
    .filter(_ => _.endsWith('.json'))
    .sort((a,b) => parseInt(a.replace(/[-.json]+/g,'0')) - parseInt(b.replace(/[-.json]+/g,'0')))
    .forEach(file => {
        let content = require(basePath + "/data_json/" + file);
        tmp = [timeFormat(file.split('.json')[0])];
        for (let i in allWant) {
            if (allWant[i] in content) {
                outLabel.forEach(label => {
                    if (label in detaLabel) {
                        tmp.push(0);
                    } else {
                        tmp.push(labels[label](content[allWant[i]]));
                    }
                });
            } else {
                if (file === "2020-02-01.json") {
                    console.log(`${i}\t${allWant[i]}`);
                }
                outLabel.forEach(() => tmp.push(0));
            }
        }
        out.push(tmp);
    });
const outFileName = basePath + `\\Iwant\\${d.getYear() + 1900}${(d.getMonth() + 1).toLength(2)}${(d.getDate()).toLength(2)}.csv`;
for (let i in detaLabel) {
    let ind = outLabel.indexOf(i);
    if (ind !== -1) {
        out = detaLabel[i](out,ind);
    }
}
// 为数据添加表头
tmp = ["时间"];
for (let i in allWant) {
    let name = code.code2All[allWant[i]];
    name = name || "中国";
    outLabel.forEach(_ => {
        tmp.push(`${name}-${_}`);
    });
}
out.unshift(tmp);
fs.writeFileSync(outFileName,out.map(_ => _.join(',')).join('\r\n'),'utf-8');
console.log("write out");
let fn = function(filename) {
    console.log("dear" + filename);
    let command = `"${basePath}\\Iwant\\formmatter\\main_num.exe" "${filename}" "${basePath}\\Iwant\\formmatter\\nameKey.txt" "${filename.substring(0, filename.length - 4)}.xlsx"`
    console.log(command);
    spawn(command, {
        shell: true,
    });
};
fn(outFileName);

// "C:\Users\HUZENGYUN\Documents\git\文档\2019-nCoV-Datas\Iwant\formmatter\main_str.exe"
// "C:\Users\HUZENGYUN\Documents\git\文档\2019-nCoV-Datas\Iwant\2020-2-12.csv"
// "C:\\Users\\HUZENGYUN\\Documents\\git\\文档\\2019-nCoV-Datas\\Iwant\\formmatter\\nameKey.txt"
// "C:\Users\HUZENGYUN\Documents\git\文档\2019-nCoV-Datas\Iwant\2020-2-12.xlsx"