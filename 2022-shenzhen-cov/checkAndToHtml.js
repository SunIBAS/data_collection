const fs = require('fs');
const links = require('./links.json');

let d = new Date();
d.setHours(8);
d.setSeconds(0);
d.setMinutes(0);
d.setMilliseconds(0);
let copyLink = JSON.parse(JSON.stringify(links));
let ds = links.map(l => l.title).map(t => {
    // "2021年10月24日深圳市新冠肺炎疫情情况",
    let ymd = t.match(/([0-9]+)年([0-9]+)月([0-9]+)日/);
    d.setFullYear(+ymd[1]);
    d.setMonth(+ymd[2] - 1);
    d.setDate(+ymd[3]);
    return d.getTime();
});
let oneDay = 24 * 3600 * 1000 + 1000;
for (let i = 1;i < ds.length;i++) {
    if (Math.abs(ds[i] - ds[i - 1]) > oneDay) {
        console.log(`${copyLink[i].title}\t${copyLink[i - 1].title}`);
    }
}

let html = `<html>
<head>
    <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
                <style>
                .mya {
                    line-height: 60px;
                    height: 60px;
                }
</style>
</head>
<body>
<rep></rep>
</body>
<script>
    let as = document.getElementsByClassName('mya');
    for (let i = 0;i < as.length;i++) {
        as[i].onclick = function () {
            setTimeout(() => {
                this.remove();
            },1000);
        }
    }
</script>
</html>`.replace('<rep></rep>',copyLink.map(l => {
    return `<div><a class="mya" target="_blank" href="${l.link}">${l.title}</a></div>`
}).join('\r\n'));

fs.writeFileSync('./index.html',html,'utf-8');

