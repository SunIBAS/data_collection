var current_window = chrome.app.window.current();

document.getElementById('maximize').onclick = function(){
    current_window.maximize();
}
document.getElementById('minimize').onclick = function(){
    current_window.minimize();
}
document.getElementById('close').onclick = function(){
    current_window.close();
}

function inj(code) {
    ifr.executeScript(
        {code},
        function(results) {
            console.log(results)
        });
}

function jumpTo() {
    if (ifr.src == inp_url.value) {
        ifr.reload();
    } else {
        ifr.src = inp_url.value;
    }
}

let getDays = (n) => {
    let d = new Date();
    let getDay = (d) => {
        let m = d.getMonth() + 1;
        let day = d.getDate();
        return d.getFullYear() + "-" + (m < 10 ? '0':'') + m + "-" + (day < 10 ? '0':'') + day;
    }
    let ds = "";
    for (let i = 0;i < n;i++) {
        d.setTime(d.getTime() - (i ? 1 : 0) * 3600 * 1000 * 24);
        ds += getDay(d) + " ";
    }
    return ds;
}

let today = getDays(2);
let globalMessage = {};
let autoId = null;
function init() {
    document.getElementById('all').innerHTML = `<div class="inp">
        <div class="label">url :</div>
        <input id="inp_url" type="text" value="http://b2b-api.10jqka.com.cn/b2bgw/resource/h5/private/PAZQ/latest/ResearchReportSTD/ResearchReportSTD/#/yb?ckey=5DCA76E70002&THSWEBVNS=1&passingle=0&v=5.6"/>
        <button id="jumpToBtn" style="margin-left: 15px;">转到</button>
    </div>
    <div class="inp">
        <div class="label">日期 :</div><input id="dates" type="text" value="${today}"/>
        <button id="updateTimeBtn" style="margin-left: 15px;">更新</button>
    </div>
    <div class="inp">
        <div class="label">端口 :</div><input id="port" type="text" value="http://localhost:3033"/>
    </div>
    <div class="inp">
        <div class="label" style="float:left;">进度 :</div>
        <div class="label" style="width: calc(100% - 180px);height: 24px;background: white;">
            <div style="height: 24px;width: 0%;background: red;" id="processbar"></div>
        </div>
        <div style="float:right;padding-right: 25px;line-height: 24px;font-size: 15px;" id="processInfo">NaN/NaN</div>
    </div>
    <div class="inp">
        <button id="startToBtn">开始</button>
        <button id="auto">自动</button>
    </div>`;
    let startToBtnEvent = function() {
        window.toF = new toFetch(document.getElementById('port').value);
        chrome.storage.local.set({
            "__port__":document.getElementById('port').value,
            "__url__": document.getElementById('inp_url').value,
        });
        inj(`loadMore()`)
        document.getElementById('markOP').style.display = "block";
    };
    let updateTimeBtnEvent = function() {
        document.getElementById("dates").value = (function () {
            return getDays(2);
        })();
    };
    document.getElementById("jumpToBtn").onclick = jumpTo;
    document.getElementById("auto").onclick = function () {
        if (autoId) clearInterval(autoId);
        globalMessage.auto = function(tar) {
            if (tar === "injMessage") {
                startToBtnEvent();
            }
        };
        // 半天执行一次
        autoId = setInterval(function () {
            updateTimeBtnEvent();
            jumpTo();
        },1000 * 12 * 3600);
    };
    document.getElementById("updateTimeBtn").onclick = updateTimeBtnEvent;
    document.getElementById("startToBtn").onclick = startToBtnEvent;
    setTimeout(function () {
        jumpTo();
    },100);

    chrome.storage.local.get(["__port__","__url__"],function(obj) {
        if ("__port__" in obj) {
            document.getElementById('port').value = obj["__port__"];
        }
        if ("__url__" in obj) {
            document.getElementById('inp_url').value = obj["__url__"];
        }
    });

}

init();
function funDownload(datas) {
    let tasks = [];
    let total = datas.length;
    let processbar = document.getElementById('processbar');
    let processInfo = document.getElementById('processInfo');
    processbar.style.width = "0%";
    processInfo.innerText = "0/" + total;
    datas.forEach(data => {
        tasks.push((function(data) {
            toF.setContent(data).Post().then(_ => {
                if (tasks.length) {
                    processbar.style.width = ((1 - tasks.length / total) * 100) + "%"
                    processInfo.innerText = (total - tasks.length) + "/" + total;
                    tasks.shift()();
                } else {
                    processbar.style.width = "100%";
                    document.getElementById('markOP').style.display = "none";
                    processInfo.innerText = total + "/" + total;
                }
            });
        }).bind(null,data))
    });
    tasks.shift()();
}
function fd(datas,filename) {
    chrome.fileSystem.chooseEntry({
        type: 'saveFile',
        suggestedName: filename
    }, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.write(new Blob([JSON.stringify(datas,'','\t')], {type: 'text/plain'}));
        }, console.log);
    });
}
function injMessage() {
    let codes = [];
    codes.push(function () {inj(`window.addEventListener('message', function(e) {
    let d = JSON.parse(e.data);
    if (d.type == "check") {
        window.__post__ = (function (event,msg) {
            event.source.postMessage(msg, event.origin);
        }).bind(null,event);
    } else if (d.type == "back") {
        window.__post__("some thing back");
    } else if (d.type == "code") {
        window.__post__(eval(d.code));
    }
    }, false);`)});
    codes.push(function () {ifr.contentWindow.postMessage(JSON.stringify({type: 'check'}),"*")});
    window.addEventListener("message", function (event) {
        window.ret = event;
        let datas = JSON.parse(event.data);
        window.__src__data__ = datas;
        let dates = document.getElementById('dates').value.split(' ');
        let fdatas = {};
        datas = datas.filter(_ => {
            return dates.includes(_.date);
        }).map(d => {
            d.id = d.date + d.name + d.grade + d.stock;
            d.price = d.price + '';
            d.accuracy = d.accuracy + '';
            d.up = d.up ? d.up + '' : '0';
            d.pid = d.pid + '';
            return d;
        }).forEach(d => {
            if (d.id in fdatas) {} else {
                fdatas[d.id] = d;
            }
        });
        datas = [];
        for (let i in fdatas) {
            datas.push(fdatas[i]);
        }
        window.__data__ = datas;
        console.log(datas);
        funDownload(datas);
    }, false);
    codes.push(function () {inj(`    function loadOverAndReturn() {
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
    }`)});
    codes.push(function () {inj(`function loadMore() {
        document.getElementsByClassName('more')[0].click();
        setTimeout(function () {
            let curLisLength = document.getElementsByTagName('li').length;
            if (curLisLength > lisLength) {
                page++;
            }
            if (page === 14) {
                // ojbk
                loadOverAndReturn();
            } else {
                loadMore();
            }
        },1600);
    }`)});
    codes.push(function () {inj(`window.lisLength = document.getElementsByTagName('li').length;
    window.page = 1;`)});
    let id = setInterval(function () {
        if (codes.length) {
            codes.shift()();
        } else {
            clearInterval(id);
            document.getElementById('markOP').style.display = "none";
        }
        for (let i in globalMessage) {
            globalMessage[i]('injMessage');
        }
    },500);
}
ifr.addEventListener("loadstop", injMessage)

let toFetch = (function(url) {
    class _toFetch {
        // Success = 0
        // Error = 100
        // Fail = 200
        // End = 300
        constructor(url,method,content,ContentToString,parseMixin) {
            this.method = method || "";
            this.content = content || "";
            this.ContentToString = ContentToString || (_ => _);
            this.parseMixin = parseMixin || (_ => _);
            this.url = url;
            this.ErrorHandle = ()=>{};
            this.FailHandle = ()=>{};
            this.ErrorThrow = true;
            this.FailThrow = true;
        }
        setContent(content) {
            if (typeof content === "object") {
                this.content = JSON.stringify(content);
            } else {
                this.content = content;
            }
            return this;
        }
        setMethod(method) {
            this.method = method;
            return this;
        }
        // 理解为无需处理返回值的请求
        Post() {
            let that = this;
            return fetch(this.url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    content: this.ContentToString(this.content),
                    method: this.method
                }) // body data type must match "Content-Type" header
            }).then(_ => _.text()).then(_ => {
                return that.parseMixin(_);
            }).then(JSON.parse)
                .then(_ => {
                    return new Promise(function (s,f) {
                        setTimeout(function () {
                            if (_.Code === 0) {
                                s(_);
                            } else if (_.Code === 100) {
                                that.ErrorHandle(_);
                                f(new Error(_.Message));
                            } else if (_.Code === 200) {
                                that.FailHandle(_);
                                console.warn(_.Message);
                                f(new Error(_.Message));
                            }
                        },500);
                    });
                })
                .catch(e => {
                    alert(`请求[${that.method}]发生错误，${e.message}`);
                    throw e;
                });
        }
        // 理解为需要将返回值做一定处理的请求
        PostParse() {
            return this.Post()
                .then(_ => {
                    return JSON.parse(_.Content)
                })
        }

        DownloadFile(filename) {
            return fetch(host, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    content: this.ContentToString(this.content),
                    method: this.method
                }) // body data type must match "Content-Type" header
            }).then(_ => _.blob()).then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            })
        }
    }
    return new _toFetch(`${url}/insert`,"post");
});
// setTimeout(injMessage(),1000);

