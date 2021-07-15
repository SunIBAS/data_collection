const {
    get
} = require('./../../_utils/Ajax');
const fs = require('fs');
const path = require('path');
const savePath = './datas/';

let codes = [].concat(...[
    [{"name":"航天航空","code":"90.BK0480"}],
    [{"name":"造纸印刷","code":"90.BK0470"},{"name":"钢铁行业","code":"90.BK0479"},{"name":"工程建设","code":"90.BK0425"},{"name":"文化传媒","code":"90.BK0486"},{"name":"综合行业","code":"90.BK0539"},{"name":"环保工程","code":"90.BK0728"},{"name":"保险","code":"90.BK0474"},{"name":"酿酒行业","code":"90.BK0477"},{"name":"电子元件","code":"90.BK0459"},{"name":"装修装饰","code":"90.BK0725"},{"name":"电信运营","code":"90.BK0736"},{"name":"民航机场","code":"90.BK0420"},{"name":"煤炭采选","code":"90.BK0437"},{"name":"通讯行业","code":"90.BK0448"},{"name":"电力行业","code":"90.BK0428"},{"name":"安防设备","code":"90.BK0735"},{"name":"仪器仪表","code":"90.BK0458"},{"name":"汽车行业","code":"90.BK0481"},{"name":"木业家具","code":"90.BK0476"},{"name":"船舶制造","code":"90.BK0729"}],
    [{"name":"医药制造","code":"90.BK0465"},{"name":"输配电气","code":"90.BK0457"},{"name":"包装材料","code":"90.BK0733"},{"name":"水泥建材","code":"90.BK0424"},{"name":"园林工程","code":"90.BK0726"},{"name":"国际贸易","code":"90.BK0484"},{"name":"家电行业","code":"90.BK0456"},{"name":"高速公路","code":"90.BK0421"},{"name":"多元金融","code":"90.BK0738"},{"name":"农牧饲渔","code":"90.BK0433"},{"name":"电子信息","code":"90.BK0447"},{"name":"文教休闲","code":"90.BK0740"},{"name":"石油行业","code":"90.BK0464"},{"name":"券商信托","code":"90.BK0473"},{"name":"食品饮料","code":"90.BK0438"},{"name":"有色金属","code":"90.BK0478"},{"name":"贵金属","code":"90.BK0732"},{"name":"公用事业","code":"90.BK0427"},{"name":"交运设备","code":"90.BK0429"},{"name":"金属制品","code":"90.BK0739"}],
    [{"name":"纺织服装","code":"90.BK0436"},{"name":"旅游酒店","code":"90.BK0485"},{"name":"化纤行业","code":"90.BK0471"},{"name":"工艺商品","code":"90.BK0440"},{"name":"化工行业","code":"90.BK0538"},{"name":"专用设备","code":"90.BK0910"},{"name":"软件服务","code":"90.BK0737"},{"name":"农药兽药","code":"90.BK0730"},{"name":"珠宝首饰","code":"90.BK0734"},{"name":"材料行业","code":"90.BK0537"},{"name":"化肥行业","code":"90.BK0731"},{"name":"交运物流","code":"90.BK0422"},{"name":"房地产","code":"90.BK0451"},{"name":"塑胶制品","code":"90.BK0454"},{"name":"医疗行业","code":"90.BK0727"},{"name":"玻璃陶瓷","code":"90.BK0546"},{"name":"银行","code":"90.BK0475"},{"name":"机械行业","code":"90.BK0545"},{"name":"商业百货","code":"90.BK0482"},{"name":"港口水运","code":"90.BK0450"}],
]);

let url = code => {
    return `http://7.push2his.eastmoney.com/api/qt/stock/kline/get?
        cb=callback&secid=${code}&
        ut=fa5fd1943c7b386f172d6893dbfba10b&
        fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&
        fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&
        klt=101&fqt=1&beg=0&end=20500101&
        smplmt=1415&lmt=1000000&_=${(new Date().getTime())}`.split('\n')
        .map(_ => _.trim()).join('')
};

// get(url(codes[0]))
// .then(console.log);
let doing = false;
let getSeries = () => {
    if (doing) return;
    doing = true;
    let obj = codes.shift();
    console.log(`正在请求 ${obj.name}`);
    if (fs.existsSync(`${savePath}${obj.name}.json`)) {
        console.log(`${obj.name} 已存在`);
        doing = false;
        return ;
    }
    get(url(obj.code))
        .then(content => {
            content = content.substring('callback('.length,content.length - 2);
            fs.writeFileSync(`${savePath}${obj.name}.json`,content,'utf-8');
            if (!codes.length) {
                console.log('完成');
                // process.exit();
                汇集数据();
            } else {
                doing = false;
            }
        });
};
function 开始收集数据() {
    setInterval(() => {
        getSeries();
    },1000);
}
function 汇集数据() {
    console.log('开始汇集数据');
    let allDatas = {};
    fs.readdirSync('./datas')
        .filter(_ => _.endsWith('.json'))
        .filter(_ => !_.startsWith('2'))
        .forEach(f => {
            let data = JSON.parse(fs.readFileSync(`${savePath}${f}`,'utf-8'));
            data = data.data;
            allDatas[data.code] = {
                code: data.code,
                name: data.name,
                klines: data.klines.map(_ => {
                    let d = _.split(',');
                    return [
                        {
                            daten: d[0].replace(/-/g,''),
                            date: d[0],
                            open: d[1],
                            close: d[2],
                            high: d[3],
                            low: d[4],
                            range: d[5],
                            rvalue: d[6],
                            quantity: d[7],
                            amount: d[8],
                            f: d[9],
                            swap: d[12],

                        }
                    ]
                }),
            }
        });
    fs.writeFileSync('./all.json',JSON.stringify(allDatas),'utf-8');
    process.exit();
}
汇集数据();
// 开始收集数据();

function 在网页上爬取代码和名字() {
    let tds = jQuery('#table_wrapper-table').find('td.mywidth3');
    let codes = [];
    tds.each((ind,td) => {
        if (!(ind % 2)) {
            codes.push({
                name: td.children[0].innerText,
                code: td.children[0].href.split('/')[5]
            });
        }
    });
    console.log(JSON.stringify(codes));
}