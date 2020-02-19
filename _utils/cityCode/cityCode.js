let fs = require('fs');
let out = {
    name2Code: {},
    code2Name: {},
    province2Code: {},
    code2Province: {},
    all2Code: {},
    code2All: {}
};
fs.readFileSync('cityCode.txt','utf-8')
    .split(/[\r\n]/)
    .map(_ => _.split(/[ \t]/).filter(_ => _))
    .forEach(_ => {
        if (!_.length) {
            return;
        }
        if (_[0].endsWith("0000")) {
            out.province2Code[_[1]] = _[0];
            out.code2Province[_[0]] = _[1];
            out.name2Code[_[0]] = {};
            out.code2Name[_[0]] = {};
        }
        out.all2Code[_[1]] = _[0];
        out.code2All[_[0]] = _[1];
        out.name2Code[_[0].substring(0,2) + "0000"][_[1]] = _[0];
        out.code2Name[_[0].substring(0,2) + "0000"][_[0]] = _[1];
    });
fs.writeFileSync('cityCode.json',JSON.stringify(out));