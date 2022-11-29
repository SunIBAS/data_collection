// ==UserScript==
// @name         b 站抽奖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

// 流程
// 1. 确定是否可以抽奖  1.1 抽奖结束(直接离开)
// 1.0 可以抽奖
// 2. 确定是否已经关注（没有则关注）
// 3. 点击转发并留言，然后随便滑动一下窗口，然后关闭
(function() {
    'use strict';
    const noClose = false;
    const doSetIntervalList = (function() {
        let list = [];
        let runover = _=>_;
        let emptyFn = _ => _;
        return {
            clearList() {
                list = [];
            },
            setRunOver(fn) {
                runover = fn || (_=>_);
            },
            addList(whileFn,fn) {
                list.push([whileFn,fn]);
            },
            run() {
                let runing = false;
                let id = setInterval(() => {
                    if (!runing) {
                        runing = true;
                        if (list.length) {
                            let fns = list.shift();
                            fns[0]().then(() => {
                                runing = false;
                                (fns[1] || emptyFn)();
                            });
                        } else {
                            clearInterval(id);
                            runover();
                        }
                    }
                },100);
            }
        }
    })();
    const createPromiseWhileTrue = (condition,time) => {
        return function () {
            return new Promise(s => {
                let id = setInterval(() => {
                    if (condition()) {
                        clearInterval();
                        s();
                    }
                },time || 100);
            })
        }
    };
    const createPromiseWaitTime = time => {
        return function () {
            return new Promise(s => {
                setTimeout(() => {
                    s();
                },time);
            });
        }
    }

    // 确定是否还能抽奖
    function checkLottery() {
        let id = location.pathname.substring(1);
        return fetch(`https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?dynamic_id=${id}`)
            .then(_ => _.text())
            .then(JSON.parse)
            .then(ret => {
                let t = +ret.data.lottery_time;
                let ct = new Date().getTime() / 1000;
                if (ct > t) {
                    return false;
                } else {
                    return true;
                }
            });
    }

    // 留言列表（任选）
    let getComments = (function () {
        let c = [
            '抽奖抽奖',
            '非酋来也',
            '我一定可以抽到',
            '不管行不行，我都来抽奖了',
        ]
        let b =[
            '冲冲冲',
            '我来了',
            '冲鸭',
        ];
        let merge = false;
        return {
            setMerge() {
                merge = true;
            },
            getRand() {
                if (merge) {
                    b = [...b,...c];
                }
                let len = b.length;
                return b[parseInt(Math.random() * len)];
            }
        }
    })();

    // 点赞
    function toLike() {
        console.log('点赞');

        doSetIntervalList.addList(createPromiseWaitTime(2000));
        doSetIntervalList.addList(createPromiseWhileTrue(() => document.getElementsByClassName('bili-dyn-action like').length > 0),() => {
            let l = document.getElementsByClassName('bili-dyn-action like')[0];
            if (!l.classList.contains('active')) {
                l.click();
            }
        });
    }

    // 发表留言并转发
    function followAndComment() {
        console.log('准备转发并留言');
        doSetIntervalList.clearList();
        doSetIntervalList.addList(
            createPromiseWhileTrue(_ => document.getElementsByClassName('bili-dyn-action forward').length > 0),
            () => {
                let follow = document.getElementsByClassName('bili-dyn-action forward')[0];
                follow.click();
        });
        doSetIntervalList.addList(createPromiseWaitTime(1000 * 2))
        doSetIntervalList.addList(
            createPromiseWhileTrue(_ => document.getElementsByClassName('bili-rich-textarea__inner').length > 0),
            () => {
                let t = document.getElementsByClassName('bili-rich-textarea__inner')[0];
                var evt = new InputEvent('input',{
                    inputType: 'insertText',
                    data: getComments.getRand(),
                    dataTransfer: null,
                    isComposing: false,
                    isTrusted: true,
                    bubbles: true,
                    composed: true
                });
                t.dispatchEvent(evt);
        });
        doSetIntervalList.addList(createPromiseWaitTime(1000),() => {
            document.getElementsByClassName('bili-dyn-forward-publishing__action__btn')[0].click();
            console.log('留言结束，即在10s后将关闭窗口');
        })

        if (Math.random() > 0.3) {
            toLike();
        }

        doSetIntervalList.addList(createPromiseWaitTime(1000 * 10))
        doSetIntervalList.addList(() => {
            let high = parseInt(Math.random() * 500);
            let times = 5;
            let id = setInterval(() => {
                window.scrollTo(0,high);
                high += parseInt(Math.random() * 500);
                times--;
                if (!times) {
                    clearInterval(id);
                }
            },200);
            return new Promise(s => {
                setTimeout(s,1000);
            });
        },() => {
            noClose ? false : window.close();
        });
        doSetIntervalList.run();
    }

    // 关注
    function toNoti() {
        console.log('查看是否已经关注');
        doSetIntervalList.clearList();
        doSetIntervalList.addList(createPromiseWhileTrue(() => document.getElementsByClassName('bili-avatar').length > 0),() => {
            var ca = document.getElementsByClassName('bili-avatar')[1].parentElement;
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('mouseenter',false,false)
            ca.dispatchEvent(evt);
        });
        doSetIntervalList.addList(createPromiseWhileTrue(() => document.getElementsByClassName('bili-user-profile').length > 0),() => {
            var pof = document.getElementsByClassName('bili-user-profile')[0];
            var checkBtn = pof.getElementsByClassName('bili-user-profile-view__info__footer')[0].children[0];
            if (checkBtn.innerText !== "已关注") {
                checkBtn.click();
            }
        });
        doSetIntervalList.addList(createPromiseWaitTime(2000));
        doSetIntervalList.setRunOver(followAndComment);
        doSetIntervalList.run();
    }

    if ('出错啦! - bilibili.com' === window.document.title) {
        window.close();
    } {
        if (location.href.includes('level=2') || location.href.includes('level=3') || location.href.includes('level=4')) {
            toNoti();
        } else if (location.href.includes('level=1')) {
            getComments.setMerge();
            checkLottery().then(ret => {
                if (ret) {
                    toNoti();
                } else {
                    console.log(`没有抽奖项目或时间已经过期了，即将关闭`);
                    setTimeout(() => {
                        window.close();
                    },2000);
                }
            })
        }
    }
})();

// s = 'abcdefghijklmnopqrstuvwxyz'.split('')
// ret = [];
// ifs = [];
// buildFn = (ind,ss) => {
//     return `func row2Json${ind}(rows * sql.Rows) []string {
// 	var ${ss.join(',')} string
// 	rows.Scan(${ss.map(_ => `&${_}`).join(',')})
// 	return []string{${ss.join(',')}}
// }`
// }
// buildIf = ind => {
//     return `if len(columns) == ${ind} {
// 		r2j = row2Json${ind}
// 	}`
// }
// for (var i = 0;i < s.length;i++) {
//     ret.push(buildFn(i + 1,s.slice(0,i + 1)))
//     ifs.push(buildIf(i + 1))
// }
// console.log(ret.join('\r\n'))
// console.log(ifs.join('else '))
