const fs = require('fs');
const code = require('./../../source/others/cityCode.json');

const getName = (name) => {
    const _ignore = {
        待明确地区: false,
        赣江新区: false,
        两江新区: false,
        高新区: false,
        万盛经开区: false,
        外地来京人员: false,
        外地来沪人员: false,
        杨凌: false,
        外地来津人员: false,
        宁东: false,
        "巴州": false,
        外地来津: false,
        外地来粤人员: false,
        宁东管委会: false,
        胡杨河: false,
        未知地区: false,
        未明确地区: false,
        待明确: false
    };
    const _name = {
        琼中县: "琼中黎族苗族自治县",
        "鄂尔多斯鄂托克前旗": "鄂托克前旗",
        "锡林郭勒盟二连浩特": "二连浩特市",
        "通辽市经济开发区": "通辽市",
        "兴安盟乌兰浩特": "乌兰浩特市",
        "呼伦贝尔满洲里": "满洲里市",
        "赤峰市松山区": "松山区",
        "鄂尔多斯东胜区": "东胜区",
        "锡林郭勒盟锡林浩特": "锡林郭勒盟",
        "包头市东河区": "东河区",
        "呼伦贝尔牙克石": "牙克石市",
        "呼伦贝尔牙克石市": "牙克石市",
        "陵水县": "陵水黎族自治县",
        "澳门": "澳门特别行政区",
        "台湾": "台湾省",
        "香港": "香港特别行政区",
        "恩施州": "恩施土家族苗族自治州",
        "湘西自治州": "湘西土家族苗族自治州",
        "石柱县": "石柱土家族自治县",
        "彭水县": "彭水苗族土家族自治县",
        "秀山县": "秀山土家族苗族自治县",
        "酉阳县": "酉阳土家族苗族自治县",
        "甘孜州": "甘孜藏族自治州",
        "凉山州": "凉山彝族自治州",
        "阿坝州": "阿坝藏族羌族自治州",
        "黔南州": "黔南布依族苗族自治州",
        "黔东南州": "黔东南苗族侗族自治州",
        "黔西南州": "黔西南布依族苗族自治州",
        "黔南州": "黔南布依族苗族自治州",
        "伊犁州": "伊犁哈萨克自治州",
        "昌吉州": "昌吉回族自治州",
        "海北州": "海北藏族自治州",
        "第一师": "阿拉尔市",
        "第二师": "库尔勒市",
        "第三师": "喀什地区",
        "兵团第四师": "伊宁市",
        "第五师": "博乐市",
        "第六师": "五家渠市",
        "兵团第六师五家渠市": "五家渠市",
        "第七师": "奎屯市",
        "兵团第七师": "奎屯市",
        "第八师石河子": "石河子市",
        "第八师": "石河子市",
        "第八师石河子市": "石河子市",
        "兵团第八师石河子市": "石河子市",
        "第九师": "额敏县",
        "兵团第九师": "额敏县",
        "第十师": "北屯市",
        // "第十一师": "乌鲁木齐市",
        "兵团第十二师": "乌鲁木齐市",
    };
    name = name.trim();
    if (name in _name) {
        return _name[name];
    } else if (name in _ignore) {
        console.log(`\t\tignore ${name}`);
        return false;
    } else {
        return name;
    }
};
const netDataJson = {};
const basePath = './../../test/sources/';

fs.readdirSync(basePath)
    .filter(_ => _.endsWith('.json'))
    .forEach(file => {
        const nd = require(basePath + file);
        nd.forEach(d => {
            let provinceCode = code.province2Code[getName(d.provinceName)];
            if (d.provinceName in netDataJson) {} else {
                netDataJson[d.provinceName] = provinceCode;
            }
            if (provinceCode) {
                let cityCode = code.name2Code[provinceCode];
                d.cities.forEach(city => {
                    if (city.cityName in netDataJson) {
                        return;
                    }
                    let name = getName(city.cityName);
                    let get = false;
                    if (!name) {
                        netDataJson[city.cityName] = -1;
                        return;
                    }
                    for (let i in cityCode) {
                        if (i.indexOf(name) !== -1) {
                            get = true;
                            netDataJson[city.cityName] = cityCode[i];
                            break;
                        }
                    }
                    if (!get) {
                        console.log(`${city.cityName} unknowed`);
                    }
                })
            } else {
                console.log(`\t${d.provinceName} is unknowed`)
            }
        });
    });

fs.writeFileSync('./netDataJson.json',JSON.stringify(netDataJson),'utf-8');