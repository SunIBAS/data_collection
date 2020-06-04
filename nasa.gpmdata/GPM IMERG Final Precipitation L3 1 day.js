const fs = require('fs');
const {
    getFromDay,                     // 迭代获取日期
    getDayBetweenFromYearFirstDay   // 获取某一天距离新年第一天(1月1日)多少天
} = require('../_utils/getDays');
let nd = getFromDay(2019,11,1,false,false,2020,11,31);// 迭代获取时间，从 20150101 开始到今天为止
let d;          // 获取一个时间
let out = [];   // 输出内容
let userName = "刚刚注册的用户名";
let password = "刚刚注册的密码";
let getCommandLine = (d) => {
    let ftype = ['nc4','nc4.xml'];
    let year = d.substring(0,4);
    let fd = (getDayBetweenFromYearFirstDay(d) + 1).toLength(3);
    let getOne = function (ind,type) {
        return `wget --load-cookies urs_cookies --save-cookies urs_cookies --auth-no-challenge=on --keep-session-cookies 
        --user=${userName} --password=${password} --content-disposition 
        https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/${year}/${d.substring(4,6)}/3B-DAY.MS.MRG.3IMERG.${d}-S000000-E235959.V06.${type}`
            .split(/[\r\n]/).map(_ => _.trim()).join(' ');
    };
    ftype.forEach(type => out.push(getOne(0,type)));
};
for (;true;) {
    d = nd();
    if (d) getCommandLine(d);
    else {
        console.log('结束'); break;
    }
}
console.log(out.length);
fs.writeFileSync('GPM IMERG Final Precipitation L3 1 day_20191131_2020_2_29.bat',out.join('\r\n'),'utf-8');

