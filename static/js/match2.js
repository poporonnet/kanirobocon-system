import {Settings} from "./Settings.js";

const MATCH_ONCE = false


const matchT = getMatch(Settings.getNumberOfMatch("T")); // match.m8;
const matchK = getMatch(Settings.getNumberOfMatch("K")); // match.m4;

let makeMatch2 = function () {
    MiniDB.load("finalist-T", function (finalistt) {
        if (finalistt.length === 0) {
            alert("決勝トーナメントが生成されていません。");
            document.location.href = "menu.html";
        }
        MiniDB.load("finalist-K", function (finalistk) {
            if (finalistk.length === 0) {
                alert("決勝トーナメントが生成されていません。");
                document.location.href = "menu.html";
            }

            const match2 = []
            match2.push(["id", "category", "entry1id", "entry2id", "table", "series"])

            let n = 1;

            const tmat = {}
            const kmat = {}

            const getTID = function (num) {
                if (num < 0)
                    return -tmat[num]
                return finalistt[num][1]
            }
            const getKID = function (num) {
                if (num < 0)
                    return -kmat[num]
                return finalistk[num][1]
            }
            let ma = null;
            let cntt = 0;
            //let cntk = -1;
            let cntk = 0;
            for (; ;) {
                // エントリー部門
                if (cntt >= 0 && cntt < matchT.match.length) {
                    ma = matchT.match[cntt]
                    for (let i = 0; i < ma.length; i++) {
                        const m = ma[i]
                        match2.push([n, "T", getTID(m[0]), getTID(m[1]), 1, n]);
                        tmat[m[2]] = n
                        n++
                    }
                }
                // 歩行部門
                if (cntk >= 0 && cntk < matchK.match.length) {
                    ma = matchK.match[cntk]
                    for (let i = 0; i < ma.length; i++) {
                        const m = ma[i]
                        match2.push([n, "K", getKID(m[0]), getKID(m[1]), 1, n]);
                        kmat[m[2]] = n
                        n++
                    }
                }
                // エントリー部門、逆
                if (cntt >= 0 && cntt < matchT.match.length) {
                    ma = matchT.match[cntt]
                    for (let i = 0; i < ma.length; i++) {
                        const m = ma[i]
                        match2.push([n, "T", getTID(m[1]), getTID(m[0]), 1, n]);
                        tmat[m[2]] = n
                        n++
                    }
                }
                // 歩行部門、逆
                if (cntk >= 0 && cntk < matchK.match.length) {
                    ma = matchK.match[cntk]
                    for (let i = 0; i < ma.length; i++) {
                        const m = ma[i]
                        match2.push([n, "K", getKID(m[1]), getKID(m[0]), 1, n]);
                        kmat[m[2]] = n
                        n++
                    }
                }
                if (cntk < matchK.match.length) {
                    cntk++
                }
                if (cntt < matchT.match.length) {
                    cntt++
                }
                if (cntk === matchK.match.length && cntt === matchT.match.length) {
                    break
                }
            }

            MiniDB.del("match2", function (res) {
                MiniDB.create("match2", MiniDB.serialize(match2), function (res) {
                    if (res !== 1) {
                        alert("生成に失敗しました。再作成してください。");
                    } else {
                        MiniDB.create("result2", "match2id,category,entry1id,entry2id,score1,score2,time1,time2,flg1,flg2", function (res) {
                        });
                        showMatch2(match2);
                    }
                });
            });

        });
    });
};
let showMatch2 = function (match2) {
    MiniDB.load("result2", function (result2) {
        MiniDB.load("entry", function (entry) {
            let getEntry = function (id) {
                for (let i = 1; i < entry.length; i++) {
                    if (entry[i][0] === id)
                        return entry[i];
                }
                return [0, "-", "-", "-", "-", "", "", "", "", "-"];
            };

            let getResult = function (mid) {
                for (let i = 1; i < result2.length; i++) {
                    let r = result2[i];
                    if (r[0] === mid)
                        return r;
                }
                return null;
            }
            const getWinner = function (mid) {
                const r1 = getResult(mid)
                if (!r1)
                    return -mid
                const id1 = r1[2]
                const id2 = r1[3]

                if (MATCH_ONCE) {
                    const p1 = parseInt(r1[4])
                    const p2 = parseInt(r1[5])
                    return p1 > p2 ? id1 : id2
                } else {
                    for (let i = 1; i < result2.length; i++) {
                        let r2 = result2[i]
                        if (r2[2] === id2 && r2[3] === id1) {
                            const p1 = parseInt(r1[4]) + parseInt(r2[5]);
                            const p2 = parseInt(r1[5]) + parseInt(r2[4]);
                            return p1 > p2 ? id1 : id2
                        }
                    }
                }
                return -mid
            }

            let sb = "<table>";
            sb += "<tr><th>試合</th><th>部</th><th>チーム名</th><th>クラブ</th><th>ポイント</th><th>チーム名</th><th>クラブ</th></tr>";
            for (let k = 1; k < match2.length; k++) {
                let d = match2[k];

                let getEntryName = function (id) {
                    let e = getEntry(id);
                    return e[2] + (e[0] === 0 ? "" : " (" + e[0] + ")");
                };
                let getEntryClub = function (id) {
                    let e = getEntry(id);
                    return e[9]; // + (e[0] == 0 ? "" : " (" + e[0] + ")");
                };
                let id1 = d[2];
                let id2 = d[3];
                let level = d[4];
                let name1 = null;
                let name2 = null;
                let club1 = "";
                let club2 = "";
                const chkMinus = (s) => {
                    if (s == null) {
                        return false;
                    }
                    if (typeof s == "string") {
                        return s[0] === "-";
                    } else if (typeof s == "number") {
                        return s < 0;
                    }
                };

                if (chkMinus(id1)) {
                    id1 = getWinner(-parseInt(id1))
                }

                if (!chkMinus(id1)) {
                    name1 = getEntryName(id1);
                    club1 = getEntryClub(id1);
                } else {
                    name1 = "試合" + -parseInt(id1) + "の勝者";
                }

                if (chkMinus(id2)) {
                    id2 = getWinner(-parseInt(id2))
                }

                if (!chkMinus(id2)) {
                    name2 = getEntryName(id2);
                    club2 = getEntryClub(id2);
                } else {
                    name2 = "試合" + -parseInt(id2) + "の勝者";
                }
                let d2 = [
                    "<a href=score.html#2," + d[0] + ">" + d[0] + "</a>",
                    //d[1] == "T" ? "低" : "高",
                    d[1] === "T" ? "エ" : "歩",
                    name1,
                    club1,
                    "/",
                    name2,
                    club2,
                ];
                sb += "<tr>";
                for (let j = 0; j < d2.length; j++) {
                    if (j === 4) {
                        let p1 = "-";
                        let p2 = "-";
                        for (let i = 1; i < result2.length; i++) {
                            let r = result2[i];
                            if (r[2] === id1 && r[3] === id2) {
                                p1 = r[4];
                                p2 = r[5];
                            }
                        }
                        sb += "<td>" + p1 + " / " + p2 + "</td>";
                    } else {
                        sb += "<td>" + d2[j] + "</td>";
                    }
                }
                sb += "</tr>";
            }
            sb += "</table>";
            get("table").innerHTML = sb;
        });
    });
};

window.onload = function () {
    title.textContent = Settings.getTitle() + " 決勝対戦表";

    MiniDB.load("match2", function (match2) {
        if (match2.length < 2) {
            console.log("makeMatch2!!");
            makeMatch2();
        } else {
            showMatch2(match2);
        }
    });
};
