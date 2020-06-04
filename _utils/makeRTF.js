(() => {
    let zeros = [0,0,0,0,0,0,0,0];

    let changeZeroLength = function(deta) {
        if (zeros.length < deta) {
            for (;deta > zeros.length;deta--) {
                zeros.push(0);
            }
        }
    };
    Number.prototype.toLength = function (len) {
        return (this + '').toLength(len);
    };
    String.prototype.toLength = function (len) {
        let n = this;
        if (n.length < len) {
            let deta = len - (n + '').length;
            changeZeroLength(deta);
            return zeros.slice(0,deta).join('') + n;
        } else {
            return n;
        }
    };
})();
gethms = (function() {
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    let t = d.getTime();
    return function(time) {
        d.setTime(t + time);
        return `${d.getHours().toLength(2)}:${d.getMinutes().toLength(2)}:${d.getSeconds().toLength(2)},${time % 1000}`;
    }
})();
o = [];
ret.events.forEach(_ => {
    if (_.segs && _.segs.length) {
        let t = _.segs.map(_ => _.utf8).join('');
        if (t !== '\n') {
            o.push({
                f: _.tStartMs,
                t: _.tStartMs + _.dDurationMs,
                text: t
            });
        }
    }
})
oo = [];
ut = '';
for (var i = o.length-1;i >= 0;i--) {
    let _ = o[i]
    let ftime = gethms(_.f);
    let ttime = ut ? ut : gethms(_.t);
    oo.unshift('');
    oo.unshift(_.text);
    oo.unshift(ftime + ' --> ' + ttime);
    oo.unshift(i + 1);
    ut = ftime;
}
console.log(oo.join('\n'));