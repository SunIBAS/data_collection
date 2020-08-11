const fs = require('fs');
const packageRPath = "C:\\Users\\admin\\Desktop\\tmp\\PackageR\\PackageR.exe";
const nc4Path = "Z:\\2020_download_data\\SoilMoisture\\";
const currentNC4Path = "S:\\2020_download_data\\SoilMoisture\\";
const saveTifPath = "Z:\\2020_download_data\\SoilMoisture_tif\\";
// 要提取的层的名字
const layers = [
    'SoilMoi0_10cm_inst',
    'SoilMoi10_40cm_inst',
    'SoilMoi40_100cm_inst',
    'SoilMoi100_200cm_inst'
];
let toCmd = (nc4) => {
    return `${packageRPath} ReadNc4ToTif ${nc4Path}${nc4} ${saveTifPath}\\${nc4}.tif ${layers.join(' ')}`
};
let out = "";
fs.readdirSync(currentNC4Path)
    .filter(_ => _.trim())
    .filter(_ => _.endsWith('.nc4'))
    .forEach(_ => {
        out += toCmd(_) + "\r\n";
    });
fs.writeFileSync("do.bat",out,"utf-8");