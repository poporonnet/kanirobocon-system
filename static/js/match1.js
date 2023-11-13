import {Settings} from "./settings.js";

const stageT = Settings.getNumberOfStage("T"); // 2
const stageK = Settings.getNumberOfStage("K"); // 1

let entry;
let register;
let match1;

const getEntry = function (id) {
    for (let i = 1; i < entry.length; i++) {
        if (entry[i][0] === id)
            return entry[i];
    }
    return [0, "-", "-", "-", "-", "", "", "", "", "-"];
};

const makeMatch1 = function () {
    console.log("make");
    /*
        条件
            マスト
                3テーブルに割り振る
                試合数は均等にする
                左右二回する v
                試合は連続しない（6試合以上空ける）
                部門は同じもの同士で対戦する
                二回とも一人試合は避ける（奇数の場合、発生する、entryid === 0）
                対戦相手はできるだけ異なる相手にする v
                最初の3戦は一人試合をじゃないものにする v
            できるだけ
                教室同士対戦はない（個人エントリー同士はok）
                x 各教室はできるだけ固める（大型教室同士になってしまう）
                x 教室同じところはできるだけ同時に試合しない（進行具合が異なるので保証できない）
        →
            参加者だけのリストをつくる
            派閥の数を数えて、大きい順にテーブル1,2,3を割り振る?
            適当に並べて、上記条件をチェックして、入れ替える？
    */
    // 参加者リスト
    const list = [];
    let nt = 0;
    let nk = 0;
    for (let i = 1; i < register.length; i++) {
        let r = register[i][0];
        let chk = false;
        for (let j = 0; j < list.length; j++) {
            if (list[j][0] === r) {
                chk = true;
                break;
            }
        }
        if (!chk) {
            for (let j = 1; j < entry.length; j++) {
                if (entry[j][0] === r) {
                    list.push(entry[j]);
                    if (entry[j][1] === "T")
                        nt++;
                    else
                        nk++;
                    break;
                }
            }
        }
    }
    // 奇数時、ダミーエントリー追加し、必ず偶数にする
    if (nt % 2 === 1) {
        list.push([0, "T", "-", "-", "-", "", "", "", "", "-"]);
        nt++;
    }
    if (nk % 2 === 1) {
        list.push([0, "K", "-", "-", "-", "", "", "", "", "-"]);
        nk++;
    }
    console.log(nt, nk);
    // 低学年と高学年に分ける
    let listt = [];
    let listk = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i][1] === "T")
            listt.push(list[i]);
        else
            listk.push(list[i]);
    }
    // 対戦表
    let match = [];
    // シャッフルして、半分に分けて、条件に合うように組み合わせる
    const make = function (orglist, first, k) {
        let mt = [];
        let list = orglist.concat();
        let listhalf = list.length / 2;
        let success = true;
        for (let i = 0; i < listhalf; i++) {
            let entry1 = list[i];
            let entry2 = null;
            for (let j = listhalf; j < list.length; j++) {
                entry2 = list[j];
                if (entry2[1] !== entry1[1]) // 部門違いはありえないはず
                    continue;
                if (
                    k < 10 && (entry2[0] !== entry1[0] && (entry2[9] === "個人エントリー" || entry2[9] !== entry1[9])) ||
                    entry2[0] !== entry1[0]
                ) {
                    if ((!first) && k < 20) {
                        let hit = false;
                        for (let l = 0; l < match.length; l++) {
                            if (match[l][0][0] === entry1[0] && match[l][1][0] === entry2[0]) {
                                hit = true;
                                break;
                            }
                        }
                        if (!hit) {
                            list.splice(j, 1);
                            break;
                        }
                    } else {
                        list.splice(j, 1);
                        break;
                    }
                }
                entry2 = null;
            }
            if (entry2) {
                if (first) {
                    mt.push([entry1, entry2]);
                } else {
                    mt.push([entry2, entry1]);
                }
            } else {
                success = false;
                break;
            }
        }
        if (!success) {
            console.log("retry! " + k);
            return false;
        }
        for (let i = 0; i < mt.length; i++)
            match.push(mt[i]);
        return true;
    };

    const ignoreNull = function (list) {
        // ダミーは一番最後にする（一人試合は一番最後）
        for (let i = 0; i < list.length; i++) {
            if (list[i][0] === 0) {
                let t = list[list.length / 2 - 1];
                list[list.length / 2 - 1] = list[i];
                list[i] = t;
                break;
            }
        }
    };
    const shuffleAfterHalf = function (list) {
        // 前半分の前半分でシャッフル
        let l4 = list.length / 4;
        let off4 = l4;
        if (l4 !== Math.floor(l4)) {
            l4 = Math.floor(l4);
            off4 = l4 + 1;
        }
        for (let i = 0; i < l4; i++) {
            let n = rnd(l4);
            let t = list[i];
            list[i] = list[n];
            list[n] = t;
        }
        // 前半分の後半分でシャッフル
        for (let i = 0; i < l4; i++) {
            let n = rnd(l4);
            let t = list[i + off4];
            list[i + off4] = list[n + off4];
            list[n + off4] = t;
        }

        // 後半分の前半分でシャッフル
        let off2 = list.length / 2;
        for (let i = 0; i < l4; i++) {
            let n = rnd(l4);
            let t = list[i + off2];
            list[i + off2] = list[n + off2];
            list[n + off2] = t;
        }
        // 後半分の後半分でシャッフル
        let off3 = list.length / 2 + off4;
        for (let i = 0; i < l4; i++) {
            let n = rnd(l4);
            let t = list[i + off3];
            list[i + off3] = list[n + off3];
            list[n + off3] = t;
        }
    };
    for (let i = 0; i < 100; i++) {
        match = [];
        shuffle(listt);
        ignoreNull(listt);
        shuffle(listk);
        ignoreNull(listk);

        if (!make(listt, true, i))
            continue;
        if (!make(listk, true, i))
            continue;

        shuffleAfterHalf(listt);
        shuffleAfterHalf(listk);

        if (!make(listt, false, i))
            continue;
        if (!make(listk, false, i))
            continue;
        break;
    }
    if (match.length === 0) {
        alert("予選対戦が作成できませんでした。エントリーを見直してください。");
        return;
    }

    if (stageT > 2 || stageT < 1 || stageK !== 1) {
        alert("非対応のステージ数が設定されています。getNumberOfStage()を見直してください。");
        return;
    }
    // 3テーブルに割り振る
    // 多い方に2テーブル割り振る
    let bigger = "T";
    match1 = [];
    match1.push(["id", "category", "entry1id", "entry2id", "table", "series"]);
    let id = 1;
    for (let i = 0; i < match.length; i++) {
        let m = match[i];
        if (m[0][1] === bigger) {
            if (stageT === 2) {
                match1.push([id, m[0][1], m[0][0], m[1][0], id % 2 + 1, Math.floor((id - 1) / 2) + 1]);
            } else if (stageT === 1) {
                match1.push([id, m[0][1], m[0][0], m[1][0], 1, id]);
            }
            id++;
        }
    }
    let idt = 1;
    for (let i = 0; i < match.length; i++) {
        let m = match[i];
        if (m[0][1] !== bigger && stageK === 1) {
            match1.push([id++, m[0][1], m[0][0], m[1][0], 3, idt++]);
        }
    }
    MiniDB.create("match1", MiniDB.serialize(match1), function (res) {
        if (res !== 1) {
            alert("生成に失敗しました。再作成してください。");
        }
    });
};
const showMatch1 = function () {
    for (let i = 1; i <= 3; i++) {
        let sb = "<h2>予選 " + "ABC".charAt(i - 1) + "ステージ</h2><table>";
        sb += "<tr><th>試合</th><th>部</th><th>左コース</th><th>右コース</th></tr>";
        for (let k = 1; k < match1.length; k++) {
            let d = match1[k];
            if (d[4] !== i)
                continue;

            let getEntryName = function (id) {
                let e = getEntry(id);
                return e[2] + (e[0] === 0 ? "" : " (" + e[0] + ")");
            };
            let d2 = [
                "<a href=score.html#1," + d[0] + ">" + d[4] + "-" + d[5] + "</a>",
                d[1] === "T" ? "エ" : "歩",
                //d[1] === "T" ? "低" : "高",
                getEntryName(d[2]),
                getEntryName(d[3]),
            ];
            sb += "<tr>";
            for (let j = 0; j < d2.length; j++)
                sb += "<td>" + d2[j] + "</td>";
            sb += "</tr>";
        }
        sb += "</table>";
        get("table" + i).innerHTML = sb;
    }
};

window.onload = function () {
    title.textContent = Settings.getTitle() + " 予選対戦表";

    MiniDB.load("entry", function (entry0) {
        MiniDB.load("register", function (register0) {
            MiniDB.load("match1", function (match10) {
                entry = entry0;
                register = register0;
                match1 = match10;

                if (match1.length === 0) { // 作成
                    makeMatch1();
                    MiniDB.create("result1", "match1id,category,entry1id,entry2id,score1,score2,time1,time2,flg1,flg2", function (res) {
                    });
                }
                showMatch1();
            });
        });
    });
};
