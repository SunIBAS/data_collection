const fs = require('fs');
const {
    getFromDay,                     // 迭代获取日期
    getDayBetweenFromYearFirstDay   // 获取某一天距离新年第一天(1月1日)多少天
} = require('../../_utils/getDays');
const account = require('../../sources/nasaCount.json');
let nd = getFromDay(2003,2,1,false,true,2014,12,31);// 迭代获取时间，从 20150101 开始到今天为止
let d;          // 获取一个时间
let out = [];   // 输出内容
let userName = account.username;
let password = account.password;
let getCommandLine = (d) => {
    let ftype = ['nc4','nc4.xml'];
    let find = ['0000','0300','0600','0900','1200','1500','1800','2100'];
    let year = d.substring(0,4);
    let fd = (getDayBetweenFromYearFirstDay(d) + 1).toLength(3);
    let getOne = function (ind,type) {
        let filename = `GLDAS_NOAH025_3H.A${d}.${ind}.021.${type}`;
        return `if not exist ${filename} wget --no-check-certificate --load-cookies urs_cookies --save-cookies urs_cookies --auth-no-challenge=on --keep-session-cookies 
        --user=${userName} --password=${password} --content-disposition 
        https://hydro1.gesdisc.eosdis.nasa.gov/data/GLDAS/GLDAS_NOAH025_3H.2.1/${year}/${fd}/${filename}`
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

fs.writeFileSync('batchGLDAS.bat',"chcp 65001\r\n" + out.join('\r\n'),'utf-8');

