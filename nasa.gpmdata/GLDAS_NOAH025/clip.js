// 计算每个月的平均值
const fs = require('fs');
const packageRPath = "D:\\software\\packageR\\PackageR.exe";
const currentTifPath = "S:\\2020_download_data\\SoilMoisture_month_avg\\";
const TifPath = "Y:\\2020_download_data\\SoilMoisture_month_avg\\";
const ShpPath = "C:\\Users\\Administrator\\Desktop\\tmp\\rshp\\area.shp";
const saveTifPath = "Z:\\2020_download_data\\SoilMoisture_month_avg\\";

let cmd = (tifname) => {
    let clip = tifname.substring(0,tifname.length - 4) + ".clip.tif";
    return `${packageRPath}  ClipTifByShp ${TifPath}${tifname} ${ShpPath} ${TifPath}${clip} false\r\n`;
}
let out = "";
fs.readdirSync(currentTifPath)
.filter(_ => _.endsWith('.tif'))
.forEach(tif => {
    out += cmd(tif);
});

fs.writeFileSync("do.bat",out,'utf-8');