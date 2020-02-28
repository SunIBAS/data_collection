const fs = require('fs');
const {
    getFromDay,                     // 迭代获取日期
    getDayBetweenFromYearFirstDay   // 获取某一天距离新年第一天(1月1日)多少天
} = require('../_utils/getDays');
let nd = getFromDay(2015,1,1,false,true);// 迭代获取时间，从 20150101 开始到今天为止
let d;          // 获取一个时间
let out = [];   // 输出内容
let userName = "刚刚注册的用户名";
let password = "刚刚注册的密码";
let getCommandLine = (d) => {
    let ftype = ['nc4','nc4.xml'];
    let find = ['0000','0300','0600','0900','1200','1500','1800','2100'];
    let year = d.substring(0,4);
    let fd = (getDayBetweenFromYearFirstDay(d) + 1).toLength(3);
    let getOne = function (ind,type) {
        return `wget --load-cookies urs_cookies --save-cookies urs_cookies --auth-no-challenge=on --keep-session-cookies 
        --user=${userName} --password=${password} --content-disposition 
        https://hydro1.gesdisc.eosdis.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/${year}/${fd}/GLDAS_NOAH025_3H.A${d}.${ind}.021.${type}`
            .split(/[\r\n]/).map(_ => _.trim()).join(' ');
    };
    find.forEach(ind => {
        ftype.forEach(type => out.push(getOne(ind,type)));
    });
};
for (;true;) {
    d = nd();
    if (d) getCommandLine(d);
    else {
        console.log('结束'); break;
    }
}
console.log(out.length);
fs.writeFileSync('batchGLDAS.bat',out.join('\r\n'),'utf-8');

