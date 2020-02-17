const fs = require("fs");
const code = require('./../others/cityCode.json');
const cityNameChange = require('./../changeName.js').cityNameChange;
const pro = code.province2Code;

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

const more = {
    "中国": `11791	17988	243	259
14380	19544	328	304
17205	21558	475	361
20438	23214	632	425`.split(/[\r\n]/).map(_ => _.split('\t').filter(_ => _)),
    "香港": `13	0	0	0
14	0	0	0
15	0	0	0
15	0	0	0`.split(/[\r\n]/).map(_ => _.split('\t').filter(_ => _)),
    "台湾": `10 0 0 0
    10 0 0 0
    10 0 0 0
    10 0 0 0`.split(/[\r\n]/).map(_ => _.split(' ').filter(_ => _)),
};

let getCode = (function () {
    let moreAreaName = {
        "神农架地区": "神农架林区",
        "济源示范区": "济源市",
        "湘西州": "湘西土家族苗族自治州",
        "铜仁地区": "铜仁市",
        "吐鲁番地区": "吐鲁番市",
        "杨凌示范区": "杨陵区",
        "奉节县": "奉节县",
        "秀山县":"秀山土家族苗族自治县",
        "石柱县": "石柱土家族自治县",
        "第一师": "阿拉尔市",
        "第二师": "库尔勒市",
        "第三师": "喀什地区",
        "第四师": "伊宁市",
        "第五师": "博乐市",
        "第六师": "五家渠市",
        "第七师": "奎屯市",
        "第八师": "石河子市",
        "第九师": "额敏县",
        "第十师": "北屯市",
        // "第十一师": "乌鲁木齐市",
        // "第十二师": "乌鲁木齐市",
        "浦东区": "浦东新区",
        "琼中县": "琼中黎族苗族自治县",
        "陵水县": "陵水黎族自治县",
        "湘西自治州": "湘西土家族苗族自治州",
        "第八师石河子": "石河子市",
        "第八师石河子市": "石河子市",
        "呼和浩特（新城区）": "呼和浩特市",
        "呼伦贝尔满洲里": "呼伦贝尔市",
        "锡林郭勒盟锡林浩特": "锡林郭勒盟",
        "锡林郭勒盟二连浩特": "锡林郭勒盟",
        "鄂尔多斯东胜区": "东胜区",
        "鄂尔多斯鄂托克前旗":"鄂托克前旗",
        "赤峰市松山区": "松山区",
        "赤峰市林西县": "林西县",
        "呼伦贝尔牙克石": "牙克石市",
        "兴安盟乌兰浩特": "乌兰浩特市",
        "包头市昆都仑区": "昆都仑区",
        "通辽市经济开发区": "通辽市",
        "包头市东河区": "东河区",
        "呼伦贝尔牙克石市": "牙克石市",
        "南阳（含邓州）": "南阳市",
        "商丘（含永城）": "商丘市",
        "安阳（含滑县）": "安阳市",
        "新乡（含长垣）": "新乡市",
        "彭水县": "彭水苗族土家族自治县"
    };
    let ignore = [
        '外地来津人员',
        '宁东管委会',
        '外地来沪人员',
        '外地来京人员',
        '两江新区',
        '高新区',
        "宁东",
        "未知地区",
        "外地来穗人员",
        "外地来粤人员",
        "外地来津",
        "胡杨河",
        "武汉来京人员",
        "未知",
        "不明地区",
        "待明确",
        "澳门",
        "待明确地区",
        "未明确",
        "北海州",
        "北海",
        "杨凌",
    ];
    let _get = function (name,provinceIndex) {
        let cityCode = -1;
        name = name.trim();
        for (let i in code.name2Code[provinceIndex]) {
            if (i.indexOf(name) + 1) {
                cityCode = code.name2Code[provinceIndex][i];
            }
        }
        if (cityCode === -1) {
            if (name in moreAreaName) {
                return _get(moreAreaName[name],provinceIndex);
            } else if (name[name.length - 1] === "州") {
                return _get(name.substring(0,name.length - 1),provinceIndex);
            } else {
                if (ignore.includes(name)) {
                    return -2;
                } else {
                    return -1;
                }
            }
        } else {
            return cityCode;
        }
    };
    return _get;
})();

function doCsv(basePath,norepeat,cb) {
    cb = cb || (() => {});
    let file = {};
    fs.readdirSync(basePath + '/source/csvFile').filter(_ => _.endsWith(".csv")).forEach(_ => {
        file[_] = '2020-' + _.split('.')[0]
            .split('-')
            .map(_ => _.toLength(2)).join('-') + '.txt';
    });
    if (norepeat) {
        for (let i in file) {
            if (fs.existsSync(`${basePath}/datas/${file[i]}`)) {
                delete file[i];
            }
        }
    }
    for (let i in file) {
        let out = [
            ["flag","area","confirmed","suspected","cured","dead"]
        ];
        let keys = [];
        console.log("start to dear with file => " + i);
        let morInd = -1;
        if (i === '1-31.csv') {
            morInd = 0;
        } else if (i === '2-1.csv') {
            morInd = 1;
        } else if (i === '2-2.csv') {
            morInd = 2;
        } else if (i === '2-3.csv') {
            morInd = 3;
        }
        if (morInd !== -1) {
            out.push(["000000","中国",more.中国[morInd][0],more.中国[morInd][1],more.中国[morInd][2],more.中国[morInd][3]]);
            out.push(["810000","香港特别行政区",more.香港[morInd][0],more.香港[morInd][1],more.香港[morInd][2],more.香港[morInd][3]]);
            out.push(["710000","台湾省",more.台湾[morInd][0],more.台湾[morInd][1],more.台湾[morInd][2],more.台湾[morInd][3]]);
        }
        fs.readFileSync(basePath + 'source\\csvFile\\' + i,'utf-8')
            .split(/[\r\n]/)
            .map(_ => _.split(','))
            .forEach((line,ind) => {
                if (!ind) {
                    return;
                }
                if (line[0] === "澳门") {
                    line[0] = "澳门特别行政区";
                }
                if (line[0] in pro && !keys[line[0]]) {
                    keys[line[0]] = pro[line[0]];
                    out.push([
                        pro[line[0]],
                        line[0],
                        line[2],
                        line[3],
                        line[4],
                        line[5]
                    ]);
                }
                if (line[0] === "澳门特别行政区") {
                    return;
                }
                if (line[1] && !keys[line[1]]) {
                    keys[line[1]] = true;
                    let cityCode = getCode(line[1],keys[line[0]]);
                    if (cityCode === -1) {
                        console.log(line.join('\t'));
                        return;
                    }
                    cityCode = cityCode === -2 ? -1 : cityCode;
                    out.push([
                        cityCode,
                        cityCode !== -1 ? code.code2Name[keys[line[0]]][cityCode] : line[1],
                        line[6],
                        line[7],
                        line[8],
                        line[9]
                    ]);
                }
            });
        fs.writeFileSync(`${basePath}/datas/${file[i]}`,out.map(_ => _.join(',')).join('\r\n'));
    }
    cb();
}

module.exports = doCsv;
