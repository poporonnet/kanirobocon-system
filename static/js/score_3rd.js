
let preflg = true;
let goalpointflg = false;
let matchno = "1";
let t1s = 0;
let t2s = 0;

window.onload = function () {
    let hash = document.location.hash;
    if (hash.length <= 1) {
        const entry = [];
        const match = [];
        const result = [
            -1,
            0,
            0, 0,
            0, 0,
            "", "",
            "00000000000", "00000000000"
        ];
        goalpointflg = true;
        init(entry, match, result);
    } else {
        let nn = hash.substring(1).split(',');
        matchno = nn[0];
        preflg = matchno === '1';
        goalpointflg = !preflg;

        let match1id = nn[1];
        MiniDB.load("entry", function (entry) {
            MiniDB.get("match" + matchno, match1id, function (match) {
                MiniDB.get("result" + matchno, match1id, function (result) {
                    // 受信した値をセット
                    if (result.length === 1) { // 無い場合、初期データ設定
                        let id1 = match[2];
                        let id2 = match[3];
                        //console.log(id1, id2)
                        if (id1 < 0 || id2 < 0) {
                            // entryidが、確定していない場合
                            MiniDB.load("result" + matchno, function (resall) {
                                let getWinner = function (matchid) {
                                    let e1 = null;
                                    let e2 = null;
                                    let p1 = 0;
                                    let p2 = 0;
                                    for (let i = 1; i < resall.length; i++) {
                                        let r = resall[i];
                                        if (r[0] === matchid) {
                                            e1 = r[2];
                                            e2 = r[3];
                                            p1 = parseInt(r[4]);
                                            p2 = parseInt(r[5]);
                                        }
                                    }
                                    if (e1 === null || e2 === null) {
                                        alert("対戦結果データがありません");
                                        window.location.href = "match2.html";
                                        return 0;
                                    }
                                    for (let i = 1; i < resall.length; i++) {
                                        let r = resall[i];
                                        if (r[2] === e2 && r[3] === e1) {
                                            p1 += parseInt(r[5]);
                                            p2 += parseInt(r[4]);
                                        }
                                    }
                                    return p1 > p2 ? e1 : e2;
                                };
                                let eid1 = id1
                                let eid2 = id2
                                if (eid1 < 0) {
                                    eid1 = getWinner(-eid1);
                                    if (eid1 === 0)
                                        return;
                                }
                                if (eid2 < 0) {
                                    eid2 = getWinner(-eid2);
                                    if (eid2 === 0)
                                        return;
                                }
                                //console.log(eid1, eid2);
                                result = [
                                    match1id,
                                    match[1],
                                    eid1, eid2,
                                    0, 0,
                                    "", "",
                                    "00000000000", "00000000000"
                                ];
                                init(entry, match, result);
                            });
                        } else {
                            result = [
                                match1id,
                                match[1],
                                match[2], match[3],
                                0, 0,
                                "", "",
                                "00000000000", "00000000000"
                            ];
                            init(entry, match, result);
                        }
                    } else {
                        init(entry, match, result);
                    }
                });
            });
        });
    }
};
let init = function (entry, match, result) {
    if (preflg) {
        init2(entry, match, result);
    } else {
        // 前回試合データを取得
        MiniDB.load("result" + matchno, function (resall) {
            for (let i = 1; i < resall.length; i++) {
                let r = resall[i];
                if (r[2] === result[3] && r[3] === result[2]) {
                    init2(entry, match, result, r);
                    return;
                }
            }
            init2(entry, match, result);
        });
    }
};
let lastpnt = 11;
let init2 = function (entry, match, result, resultbefore) {
    let showPoint = function () {
        for (let i = 1; i <= 2; i++) {
            let p = "p" + i;
            let pnt = 0;
            for (let j = 0; j <= lastpnt; j++) {
                if (get(p + "c" + j).checked) {
                    //if (j === 4 || j === 10) {
                    //if (j === 4 || j === 10 || j === 7 || j === 8) { // 奥レアメタルも+2 // 2019
                    if (j === 4) { // 地球帰還のみ2点 2020
                        pnt += 2;
                    } else if (j === 5) { //  || j === 9) {
                        if (goalpointflg)
                            pnt++;
                    } else {
                        pnt++;
                    }
                }
            }
            get(p).textContent = pnt;

            if (preflg) {
                get(p + "s").textContent = "";
            } else {
                if (!resultbefore) {
                    get(p + "s").textContent = pnt + "+0=" + pnt;
                } else {
                    let pntbefore = resultbefore[i === 1 ? 5 : 4];
                    get(p + "s").textContent = pntbefore + "+" + pnt + "=" + (parseInt(pntbefore) + pnt);
                }
            }
        }
    };
    let changeTime = function (time) {
        let t = time.split(":");
        let t2 = 180 - (parseInt(t[0]) * 60 + parseInt(t[1]));
        return Math.floor(t2 / 60) + ":" + fixnum(t2 % 60, 2);
    };

    for (let i = 1; i <= 2; i++) {
        let p = "p" + i;
        for (let j = 0; j <= lastpnt; j++) {
            if (j === 5) { // ゴール時
                get(p + "c" + j).entryid = i;
                get(p + "c" + j).onchange = function () {
                    if (this.checked) {
                        get("time" + this.entryid).textContent = changeTime(time.textContent);
                    } else {
                        get("time" + this.entryid).textContent = "";
                    }
                    showPoint();
                };
            } else {
                get(p + "c" + j).onchange = showPoint;
            }
        }
    }
    const resetPointAll = function () {
        for (let i = 1; i <= 2; i++) {
            let p = "p" + i;
            for (let j = 0; j <= lastpnt; j++) {
                get(p + "c" + j).checked = false;
            }
            get("time" + i).textContent = "";
        }
        showPoint();
    };
    const resetPoint = function (n) {
        let p = "p" + n;
        for (let j = 0; j <= lastpnt; j++) {
            get(p + "c" + j).checked = false;
        }
        get("time" + n).textContent = "";
        showPoint();
    };
    p1.onclick = function () {
        resetPoint(1);
    };
    p2.onclick = function () {
        resetPoint(2);
    };
    let remaint = 0;
    let lastt = 0;
    let timer = function () {
        let t = new Date().getTime();
        if (lastt) {
            remaint -= t - lastt;
        }
        lastt = t;

//		let limitt = (6 * 60) * 1000 + (1000 - 1);
        let dt = remaint;
        if (dt < 0)
            dt = 0;
        let min = Math.floor(dt / 1000 / 60);
        let sec = Math.floor(dt / 1000 % 60);
        let s = min + ":";
        if (sec < 10)
            s += "0";
        s += sec;
        time.textContent = s;
    };
    let tid = null;
    let TID_STOP = {};
    time.onmousedown = function () {
//		baset = new Date().getTime();
        if (tid) {
            if (tid === TID_STOP) {
                resetTimer();
            } else {
                clearInterval(tid);
                tid = TID_STOP;
                lastt = 0;
            }
        } else {
            tid = setInterval(timer, 100);
        }
    };

    let matchtime;
    let resetTimer = function () {
        clearInterval(tid);
        tid = null;
        lastt = 0;
        time.textContent = matchtime + ":00";
        remaint = matchtime * 60 * 1000;// + 999;
    };
    let showMatch = function (smatch, result) {
//		console.log(smatch);
        let matchname = smatch[1] + smatch[4] + "-" + smatch[5];
        let getMatch = function (s) {
            if (s.startsWith("T")) {
                s = "エントリー部門 " + s.substring(1);
            } else if (s.startsWith("K")) {
                s = "歩行部門 " + s.substring(1);
            } else {
                s = "";
            }
            return s;
        };
        get("match").textContent = getMatch(matchname);
        let getTeam = function (entryid) {
            for (let i = 1; i < entry.length; i++) {
                if (entry[i][0] === entryid) {
                    return entry[i][2]
                }
            }
            return "";
        };

        t1.textContent = getTeam(result[2]);
        t2.textContent = getTeam(result[3]);

        matchtime = 3; //matchname.startsWith("T") ? 4 : 6;
        resetTimer();

//		resetPointAll();

        get("time1").textContent = result[6];
        get("time2").textContent = result[7];
        deserializeChecks(1, result[8]);
        deserializeChecks(2, result[9]);
        showPoint();
    };

    let serializeChecks = function (n) {
        let s = "";
        let p = "p" + n;
        for (let j = 0; j <= lastpnt; j++) {
            s += get(p + "c" + j).checked ? "1" : "0";
        }
        return s;
    };
    let deserializeChecks = function (n, s) {
        let p = "p" + n;
        for (let j = 0; j <= lastpnt; j++) {
            get(p + "c" + j).checked = s.charAt(j) === "1";
        }
    };
//	10000000000

    showMatch(match, result);

    window.onbeforeunload = function () {
        if (result[0] < 0) {
            window.location.href = "menu.html";
            return;
        }
        // サーバーに保存
        //result
        //		match1id,category,entry1id,entry2id,score1,score2,time1,time2,flg1,flg2
        //match
        //		id,category,entry1id,entry2id,table,series
        result[4] = get("p1").textContent;
        result[5] = get("p2").textContent;
        result[6] = get("time1").textContent;
        result[7] = get("time2").textContent;
        result[8] = serializeChecks(1);
        result[9] = serializeChecks(2);

        MiniDB.set("result" + matchno, result.join(","), function (res) {
            if (res === 1) {
                window.location.href = "match" + matchno + ".html";
            } else {
                alert("スコアの登録に失敗しました。リトライしてください");
            }
        });
    };
};

function changeSide() {
    if (matchno === '1') {
        //チーム入れ替え
        let work = document.getElementById('t1name').value;
        document.getElementById("t1name").value = document.getElementById('t2name').value;
        document.getElementById("t2name").value = work;
        //ポイント設定
        document.getElementById("t1p1").value = get("p2").textContent;
        document.getElementById("t2p1").value = get("p1").textContent;
        matchno = '2';
        t1s = Number(get("p2").textContent);
        t2s = Number(get("p1").textContent);

        document.getElementById("changeButton").value = '終了'
    } else if (matchno === '2') {
        //ポイント設定
        document.getElementById("t1p2").value = get("p1").textContent;
        document.getElementById("t2p2").value = get("p2").textContent;
        t1s = t1s + Number(get("p1").textContent);
        t2s = t2s + Number(get("p2").textContent);
        document.getElementById("t1total").value = t1s;
        document.getElementById("t2total").value = t2s;
        matchno = '9';
    }

    let e = new Event('click');
    let target = document.getElementById('p1');
    target.dispatchEvent(e);
    target = document.getElementById('p2');
    target.dispatchEvent(e);
};


document.addEventListener("touchmove", function (e) {
    e.preventDefault();
}, false);
