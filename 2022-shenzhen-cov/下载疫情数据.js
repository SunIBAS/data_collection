// const {
//     get
// } = require('./../../_utils/Ajax');
const https = require("https");     //
const http = require('http');       //
const fs = require('fs');           // 三个结合

/**
 * 定义一个请求模块，模拟浏览器的 GET 请求
 * @return Promise
 * */
const get = function(url,option) {
    option = option || {};
    const httpGet = http.get.bind(http);
    const httpsGet = https.get.bind(https);
    let getMethod = (function (url) {
        if (url.startsWith('http://')) {        //判断url是否由https还是http获取
            return httpGet;
        } else if (url.startsWith('https://')) {
            return httpsGet;
        }
    })(url);
    return new Promise(function (scb,fcb) {      // 使用 Promise 返回请求数据（）
        getMethod(url,option,(resp) => {         // 发起请求
            let data = '';
            resp.on('data',(chunk) => {          // 输出：持续下载数据或者结束下载
                data += chunk
            });
            resp.on('end',() => {
                scb(data);
            });
            resp.on("error",fcb);
        });
    })
};
class Utils {                 //处理css文件
    // 处理 导航 数据
    static dearWithNav(txt) {
        // let txt = fs.readFileSync('./nav.txt','utf-8');
        txt = txt.replace(/document\.writeln\("[ \t]+/g,'');    // 将所有的 document.writeln("\t 替换为 ''
        let txtSp = txt.split('\r\n');                          // 将数据按行分割为数组
        let i = 0;
        for (;i < txtSp.length;i++) {                           // 对每一行进行查找，知道行内容为 document.writeln(""); 时，停止匹配
            if (txtSp[i] === 'document.writeln("");') {
                break;
            }
        }

        const getLinkAndName = str => {
            // console.log(str);
            // 匹配汉字
            let name = str.match(/[\u4e00-\u9fa5]+/);    //unicode utf -8
            if (name) {
                name = name[0];
            } else {
                return null;
            }
            //
            let link = str.match(/href=\\'[a-zA-Z?.=\/0-9]+/)[0].substring(7);
            return {name,link};
        }

        let citys = [];
        for (;i < txtSp.length;i += 10) {   // 每十行是一个数据结构

            let pName = getLinkAndName(txtSp[i + 9].split('"')[0]); // 从每十行的第九行获取到省名称和链接
            if (!pName) {                                           // 如果获取不到表示遍历结束
                break;
            }
            pName.children = [];
            // arr = [`<li><a href=\'/covid/list.asp?id=422\'>仙桃</a>`]
            txtSp[i + 10].split('</li>').map(str => { // 接下来的一行 是该省的 城市链接
                if (str.length > 10) {
                    pName.children.push(getLinkAndName(str)); // 同样的结构，获取到 城市 和链接
                }
            });
            citys.push(pName);
        }

        return citys;
    }
    static dearWithCityData(txt) {  // 处理获取到的 城市的疫情数据
        let start = txt.indexOf(`$(function () { `);//
        txt = txt.substring(start);                 //
        let end = txt.indexOf(`</script>`);         //
        txt = txt.substring(0,end);                 // 获取到 疫情数据 部分，并将字符串内容裁剪出来，存在 txt
        let txtSps = txt.split('\n');
        txt = txtSps.slice(2,txtSps.length - 3).join('\n')
            .replace(/Highcharts.getOptions\(\).colors\[[0-9]+\]/g,'123');
        txt = `txt = {${txt}}`;
        txt = eval(txt);                            // 去除不必要的结构，最后获取到一个对象
        return txt;
    }

// 下载导航
    static downloadNav() {                          // 下载 nav.js 文件，并进行处理，处理后保存到 nav.json 文件中
        return get(`http://m.sy72.com/covid19/nav.js`)
            .then(txt => {
                let citys = Utils.dearWithNav(txt);
                fs.writeFileSync(`nav.json`,JSON.stringify(citys,'','\t'),'utf-8'); // 保存
                return citys;
            });
    }
    static downloadCity(link) {     // 根据 dearWithNav 获取到的城市链接获取每个城市的疫情数据，然后交给  dearWithCityData 处理后返回
        return get(`http://m.sy72.com${link}&s1=2020-1-30&s2=2022-4-28`)
            .then(txt => {
                return Utils.dearWithCityData(txt);
            });
    }
}

function mergeData() {
    let out = [];
    fs.readdirSync('./datas').filter(_ => _.endsWith('.json')).forEach(json => {
        out.push({
            area: json,
            data: require(`./datas/${json}`)
        });
    });
    fs.writeFileSync('./全国疫情数据.json',JSON.stringify(out),'utf-8');
}
function downloadAllCityData() {
    // 想要获取的省的名称
    Utils.downloadNav().then(citys => { // 获取 省-城市 链接 集合
        let downloading = false;    // 下载标记（用于正常下载，避免多个请求同时发起）

        let selectProvince = [];
        citys.forEach(c => {
            if (c.children.length) {
                c.children.forEach(_ => {
                    selectProvince.push({
                        name: `${c.name}_${_.name}`,
                        link: _.link
                    });
                })
            } else {
                selectProvince.push(c);
            }
        });

        let id = setInterval(() => {    // 定时器，每 1s 进行一次执行，
            // 如果当前 downloading 为 false 表示之前的任务下载完成，则发起新的下载任务
            if (downloading) {} else {
                if (selectProvince.length) { // 判断集合栈内是否为空，非空则继续
                    downloading = true;
                    let city = selectProvince.pop();  // 每次从集合栈中弹出一个城市链接
                    console.log(`正在下载 ${city.name} 数据`);  // 打印日志
                    Utils.downloadCity(city.link)              // 下载一个城市的数据
                        .then(data => {
                            fs.writeFileSync(`./datas/${city.name}.json`,JSON.stringify(data,'','\t'),'utf-8'); // 写出到文件中
                            downloading = false;
                        });
                } else {
                    clearInterval(id);
                    console.log(`下载完成`);
                    mergeData();
                }
            }
        },1000);
    });
}

// downloadAllCityData();

mergeData()

