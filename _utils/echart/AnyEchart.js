window.packageMethod = function (fn,addFn) {
    if (typeof fn !== 'function') {
        fn = (() => {});
    }
    return function () {
        fn();
        addFn();
    }
}
class AnyEchart {
    constructor(parentNode,id) {
        this.parentNode = typeof parentNode === "string" ? document.getElementById(parentNode) : parentNode;
        this.id = id || "__echart_" + (new Date().getTime());
        this.echart = null;
    }

    setWidthHeight(width, height) {
        this.width = width || 400;
        this.height = height || 240;
    }

    // 提供完整的 option
    showEchartWithOption(option,cb) {
        this.parentNode.innerHTML = `<div style="width: 100%;height: 100%;" id="${this.id}"></div>`;
        let el = document.getElementById(this.id);
        el.innerHTML = "";
        el.style.backgroundColor = 'white';
        // eslint-disable-next-line no-undef
        let e = echarts.init(el);
        this.echart = e;
        (cb || (() => {}))(e.resize.bind(e));
        e.setOption(option,true);
        e.resize();
        window.onresize = window.packageMethod(window.onresize,function () {
            e.resize();
        });
        return el;
    }
}