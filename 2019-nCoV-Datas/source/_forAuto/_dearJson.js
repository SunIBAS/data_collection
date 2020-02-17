let fs = require('fs');
const code = require('./../others/cityCode.json');
const cityNameChange = require('./../changeName.js');
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
    };
    let ignore = [
        '外地来津人员',
        '宁东管委会',
        '外地来沪人员',
        '外地来京人员',
        '两江新区',
        '高新区'
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

function doJson(basePath,norepeat,cb) {
    cb = cb || (() => {});
    let files = {};
    fs.readdirSync(basePath + '/source/jsonFile').filter(_ => _.endsWith(".json")).forEach(_ => {
        files[_] = '2020-' + _.split('.')[0]
            .split('-')
            .map(_ => _.toLength(2)).join('-') + '.txt';
    });

    if (norepeat) {
        for (let i in files) {
            if (fs.existsSync(`${basePath}/datas/${files[i]}`)) {
                delete files[i];
            }
        }
    }
    for (let i in files) {
        let json = require(basePath + '/source/jsonFile/' + i).component[0];
        let out = [
            ["flag","area","confirmed","suspected","cured","dead"]
        ];
        out.push(["000000","中国",json.summaryDataIn.confirmed,
            json.summaryDataIn.unconfirmed,
            json.summaryDataIn.cured,
            json.summaryDataIn.died]);
        json.caseList.forEach(province => {
            let provinceName = cityNameChange.provinceNameChange(province.area);
            if (provinceName === "澳门") {
                provinceName = "澳门特别行政区";
            }
            let provinceIndex = pro[provinceName];
            out.push([provinceIndex,provinceName,province.confirmed,
                0,
                province.crued,
                province.died]);
            if (province.subList && province.subList.length) {
                province.subList.forEach(city => {
                    let cityCode = getCode(city.city,provinceIndex);
                    cityCode = (cityCode === -2 ? -1 : cityCode);
                    if (cityCode === '-1') {
                        console.log(city);
                    }
                    out.push([cityCode,
                        code.code2Name[provinceIndex][cityCode],
                        city.confirmed || 0,
                        0,
                        city.crued || 0,
                        city.died || 0]);
                });
            }
        });
        fs.writeFileSync(basePath + '/datas/' + files[i],out.map(_ => _.join(',')).join('\r\n'));
    }
    cb();
}

module.exports = doJson;