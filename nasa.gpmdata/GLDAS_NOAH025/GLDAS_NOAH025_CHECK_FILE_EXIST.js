const fs = require('fs');
const path = require('path');
const {
    getFromDay,                     // 迭代获取日期
    getDayBetweenFromYearFirstDay   // 获取某一天距离新年第一天(1月1日)多少天
} = require('../../_utils/getDays');
const account = require('../../sources/nasaCount.json');
let nd = getFromDay(2003,2,1,false,true,2020,2,29);// 迭代获取时间，从 20150101 开始到今天为止
let d;          // 获取一个时间
let out = [];   // 输出内容
let getCommandLine = (d) => {
    let ftype = ['nc4','nc4.xml'];
    let find = ['0000','0300','0600','0900','1200','1500','1800','2100'];
    let getOne = function (ind,type) {
        return `GLDAS_NOAH025_3H.A${d}.${ind}.021.${type}`;
    };
    find.forEach(ind => {
        ftype.forEach(type => out.push(getOne(ind,type)));
    });
};
for (;true;) {
    d = nd();
    if (d) getCommandLine(d);
    else {
        console.log('统计结束'); break;
    }
}
let checkPath = "S:\\2020_download_data\\SoilMoisture";
let nexist = [];
let allFiles = fs.readdirSync(checkPath);
out.forEach(file => {
    // 检查文件是否存在
    if (!allFiles.includes(file)) {
        nexist.push(`[chck_error] ${path.join(checkPath,file)}`);
    }
});
fs.writeFileSync("./GLDAS_NOAH025_NO_EXIST.txt",nexist.join('\r\n'),"utf-8");

