import { Settings } from "./settings.js";

const MAX_ENTRY_T = Settings.getNumberOfMatch("T");
const MAX_ENTRY_K = Settings.getNumberOfMatch("K");

let mode = '';

window.onload = function() {
    const hash = document.location.hash;
    if (hash.length > 1 && hash === "#public") {
        get('make').style.display = "none";
        mode = 'public';
        title.textContent = Settings.getTitle() + " 予選ランキング";
    } else {
        mode = 'private' ;
        title.textContent = Settings.getTitle() + " 予選対戦結果";
    }

    MiniDB.load("entry", function(entry) {
        MiniDB.load("register", function(register) {
            MiniDB.load("result1", function(result1) {
                show("T", "tblt", entry, register, result1);
                show("K", "tblk", entry, register, result1);

                make.onclick = function() {
                    makeFinalist("T", entry);
                    makeFinalist("K", entry);
                };
            });
        });
    });
};
let show = function(category, tablec, entry, register, result1) {
    let list = [];
    let getEntry = function(id) {
        for (let i = 1; i < entry.length; i++)
            if (entry[i][0] === id)
                return entry[i];
        return null;
    };
    let getResult = function(id, left) {
        for (let i = 1; i < result1.length; i++) {
            let r = result1[i];
            if (left) {
                if (r[2] === id)
                    return [ r[4], parseInt(r[4]), r[6] ];
            } else {
                if (r[3] === id)
                    return [ r[5], parseInt(r[5]), r[7] ];
            }
        }
        return [ "-", 0, "-" ];
    };
    for (let i = 1; i < register.length; i++) {
        let id = register[i][0];
        let p = getEntry(id);
        if (p == null || p[1] !== category)
            continue;

        let left = getResult(id, true);
        let right = getResult(id, false);
        list.push([
            id,
            p[2],
            p[9],
            null,
            left[1] + right[1],
            left[0] + " / " + right[0],
            left[2] + " / " + right[2]
        ]);
    }
    let parseTime = function(time) {
        time = time.trim();
        if (time.length == 0 || time == "-")
            return 180;
        let t = time.split(":");
        return parseInt(t[0]) * 60 + parseInt(t[1]);
    };
    let getTimes = function(time) {
        let t = time.split("/");
        let n = 0;
        let res = [ parseTime(t[0]), parseTime(t[1]) ];
        let sum = 0;
        for (let i = 0; i < res.length; i++) {
            if (res[i] < 180) {
                n++;
            }
            sum += res[i];
        }
        res.push(n);
        res.push(sum);
        return res;
    };
    list.sort(function(a, b) {
        let dp = b[4] - a[4]; // ポイント順
        if (dp != 0)
            return dp;
        let timea = getTimes(a[6]);
        let timeb = getTimes(b[6]);
        dp = timeb[2] - timea[2]; // タイム計測回数は多いほうがいい
        if (dp != 0)
            return dp;
        const dt = timea[3] - timeb[3] // タイムは速いほうがいい
        if (dt != 0)
            return dt
        return a[0] - b[0] // どちらも同点の場合はゼッケン順
    });

    let sb = "<h2>" + (category == "T" ? "エントリー部門" : "歩行部門") + "</h2><table>";
    if ( mode == 'private') {
        sb += "<tr><th>順位</th><th>ゼッケン</th><th>チーム名</th><th>クラブ</th><th>決勝</th><th>ポイント</th><th>左 / 右</th><th>タイム</th></tr>";
    } else {
        sb += "<tr><th>順位</th><th>ゼッケン</th><th>チーム名</th><th>クラブ</th><th>ポイント</th><th>左 / 右</th><th>タイム</th></tr>";
    }
    let max = category == "T" ? MAX_ENTRY_T : MAX_ENTRY_K;
    for (let k = 0; k < list.length; k++) {
        sb += "<tr><th>" + (k + 1) + "位</th>";
        let d2 = list[k];
        for (let j = 0; j < d2.length; j++) {
            if (j != 3) {
                sb += "<td>" + d2[j] + "</td>";
            } else if ( mode == 'private' ) {
                sb += "<td><select id=sel" + category + d2[0] + ">";
                sb += "<option>-</option>";
                for (let i = 0; i < max; i++) {
                    sb += "<option";
                    if (i == k) {
                        sb += " selected";
                    }
                    sb += ">" + (i + 1) + "</option>";
                }
                sb += "</select></td>";
            }
        }
        sb += "</tr>";
    }
    sb += "</table>";
    get(tablec).innerHTML = sb;
};
let makeFinalist = function(category, entry) {
    let getEntry = function(id) {
        for (let i = 1; i < entry.length; i++)
            if (entry[i][0] == id)
                return entry[i];
        return null;
    };

    let max = category === "T" ? MAX_ENTRY_T : MAX_ENTRY_K; // -> 2019 全員通過させる
    let cat = category === "T" ? "エントリー部門" : "歩行部門";
    let list = [];
    for (let i = 1; i < entry.length; i++) {
        let e = entry[i];
        if (e[1] !== category)
            continue;

        let c = get("sel" + category + e[0]);
        if (c != null) {
            let v = c.value;
            if (v !== "-") {
                list.push([ v, e[0] ]);
            }
        }
    }

    let s = [];
    s.push(["id", "entryid", "name" ]);
    for (let i = 0; i < list.length; i++) {
        let n = i + 1
        let miss = true;
        let id = null;
        for (let j = 0; j < list.length; j++) {
            if (list[j][0] === n) {
                miss = false;
                id = list[j][1];
                break;
            }
        }
        if (miss) {
            alert(cat + " エントリー" + n + "がありません。");
            return;
        }
        s.push([ n, id, getEntry(id)[2] ]);
    }
    if (category === "T" && list.length !== MAX_ENTRY_T) {
        alert(cat + " エントリー数が" + MAX_ENTRY_T + "ではありません。");
        return;
    } else if (category === "K" && list.length !== MAX_ENTRY_K) {
        alert(cat + " エントリー数が" + MAX_ENTRY_K + "ではありません。");
        return;
    }
    MiniDB.create("finalist-" + category, MiniDB.serialize(s), function(res) {
        if (res === 1) {
            alert(cat + " 決勝トーナメントを生成しました");
        } else {
            alert(cat + " 生成に失敗しました。リトライしてください");
        }
    });
};
