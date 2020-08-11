// C:\Users\admin\Desktop\tmp\PackageR\PackageR.exe CheckNC4 Z:\2020_download_data\SoilMoisture\GLDAS_NOAH025_3H.A20030201.0600.021.nc4 a >> C:\Users\admin\Desktop\tmp\check.txt
const packageRPath = "C:\\Users\\admin\\Desktop\\tmp\\PackageR\\PackageR.exe";
const nc4Path = "Z:\\2020_download_data\\SoilMoisture\\";
const currentNC4Path = "Z:\\2020_download_data\\SoilMoisture\\";
const logPath = "C:\\Users\\admin\\Desktop\\tmp\\check.txt";
const fs = require('fs');
const fromFile = true;
let cmds = "";
// 只检查文件中指定的 nc4 文件
if (fromFile) {
    cmds = fs.readFileSync('./../GLDAS_NOAH025/fail_to_download_nc4.txt','utf-8').split('\r\n')
        .filter(_ => _)
        .map(f => {
            return `${packageRPath} CheckNC4 ${nc4Path}${f} a >> ${logPath}`;
        }).join('\n');
} else {
    cmds = fs.readdirSync(currentNC4Path)
        .filter(_ => _.endsWith('nc4'))
        .map(f => {
            return `${packageRPath} CheckNC4 ${nc4Path}${f} a >> ${logPath}`;
        }).join('\n');
}


fs.writeFileSync("./check_nc4.bat",'chcp 65001\r\n' + cmds,'utf-8');
