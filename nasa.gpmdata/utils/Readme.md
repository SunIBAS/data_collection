# 文件说明

### CheckNC4.js

检查 nc4 文件是否正常，执行完成后会生成一个 bat 批处理文件，这个文件双击运行后会生成一个 ```报告文件(logPath)```，这个 报告文件可以交给其他目录下的脚本使用

变量说明如下

```javascript
// packageR.exe 所在的位置
const packageRPath = "C:\\Users\\admin\\Desktop\\tmp\\PackageR\\PackageR.exe";
// nc4 文件的位置，这个位置是生成 bat 批处理文件中的位置
const nc4Path = "Z:\\2020_download_data\\SoilMoisture\\";
// 当前访问 nc4 文件的位置，可能生成的脚本在其他电脑执行，所以编写了这个位置
const currentNC4Path = "Z:\\2020_download_data\\SoilMoisture\\";
// 生成的检查报告文件
const logPath = "C:\\Users\\admin\\Desktop\\tmp\\check.txt";
// 表示从文件中获取要检查的 nc4 文件的文件名
// false 表示，直接检查 currentNC4Path 下所有 nc4 文件
const fromFile = true;
```
