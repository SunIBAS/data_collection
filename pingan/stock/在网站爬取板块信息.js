// https://q.stock.sohu.com/cn/bk.shtml
function getAll() {
    var tasks = [];
    var total = 0;
    var trs = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (var i = 0;i < trs.length;i++) {
        let a = trs[i].getElementsByTagName('td')[1].children[0];
        tasks.push({
            link: a.href,
            bord: a.innerText
        });
        total++;
    }
    var allData = {};
    var dearFetch = function (bord,ret) {
        if (bord in allData) {} else allData[bord] = [];
        var div = document.createElement("div");
        div.innerHTML = ret;
        var trs = div.getElementsByTagName('tr');
        for (var i = 0;i < trs.length;i++) {
            var code = (+(trs[i].getElementsByTagName('td')[0] || {innerText: ""}).innerText) + '';
            if (code.length === 6) {
                allData[bord].push(code);
            }
        }
        doit();
    }
    let doit = function() {
        let bord;
        if (tasks.length) {
            bord = tasks.pop();
            console.log(`${total - tasks.length} / ${total}`);
            fetch(bord.link).then(_ => _.text()).then((_) => {
                setTimeout(() => {
                    dearFetch(bord.bord,_);
                },100);
            });
        } else {
            window.allData = allData;
            alert('爬取完成');
        }
    }
    doit();
}