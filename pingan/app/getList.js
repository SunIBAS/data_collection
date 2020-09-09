function getList() {
    window.lisLength = document.getElementsByTagName('li').length;
    window.page = 1;
    function loadMore() {
        document.getElementsByClassName('more')[0].click();
        setTimeout(function () {
            let curLisLength = document.getElementsByTagName('li').length;
            if (curLisLength > lisLength) {
                page++;
            }
            if (page === 10) {
                // ojbk
                loadOverAndReturn();
            } else {
                loadMore();
            }
        },200);
    }
    function loadOverAndReturn() {
        let lis = document.getElementsByTagName('li');
        let datas = [];
        for (let i = 0;i < lis.length;i++) {
            let d = {
                date: "2020-08-13",
                level: "买入",
                price: "27.19",
                grade: 162,
                name: "邹戈",
                accuracy: "59.81",
                pid: 26447863,
                id: "Y0000000000000013330",
                up: "0.00",
                title: "拟大幅上调回购资金总额，长期成长空间打开",
                stock: "华新水泥",
                down: "0.00",
            };
            let ps = lis[i].getElementsByTagName("p");
            d.name = ps[0].innerText;
            d.grade = ps[1].innerText;
            d.accuracy = (function () {
                let acc = parseFloat(ps[3].innerText);
                return isNaN(acc) ? 0 : acc;
            })();
            let spans = ps[4].getElementsByTagName('span');
            d.stock = spans[1].innerText;
            d.level = spans[2].innerText;
            d.date = spans[3].innerText;
            d.title = ps[5].innerText;
            spans = ps[6].getElementsByTagName('span');
            d.price = parseFloat(spans[2].innerText)
            d.up = parseFloat(spans[5].innerText)
            datas.push(d);
        }
        window.__post__(JSON.stringify(datas));
    }
    loadMore();
}