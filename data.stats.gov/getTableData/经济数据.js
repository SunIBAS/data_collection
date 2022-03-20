// https://data.stats.gov.cn/easyquery.htm?cn=E0105&zb=A01&reg=650100&sj=2020

var tds = document.getElementById('table_main').getElementsByTagName('td');
var datas = [];
for (var i = 0;i < 4;i++) {
    var d = [];
    for (var j = 1;j < 21;j++) {
        var ind = i * 21 + j;
        d.push(+tds[ind].innerText);
    }
    datas.push(d);
}
console.log(datas[1].reverse().join('\r\n'));




var txt = document.getElementsByClassName('ewb-news-bd')[0].innerText;
var findAndCut = () => {
    var arr = [];
    var first = txt.match(/第一产业增加值[0-9.]+亿元/)[0];
    arr.push(first.substring(7,first.length - 2));
    first = txt.match(/第二产业增加值[0-9.]+亿元/)[0];
    arr.push(first.substring(7,first.length - 2));
    first = txt.match(/第三产业增加值[0-9.]+亿元/)[0];
    arr.push(first.substring(7,first.length - 2));
    return arr;
}
console.log(findAndCut().join('\t'));
