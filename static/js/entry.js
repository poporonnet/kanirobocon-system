import { Settings } from "../lib/settings.js";

window.onload = function() {
    title.textContent = Settings.getTitle() + " エントリー受付";

    MiniDB.load("entry", function(csv) {
        MiniDB.load("register", function(register) {
            console.log(register);
            if (register.length === 0) {
                MiniDB.create("register", "entryid,datetime", function(res) {
                });
            }
//			dump(register);

            let sb = "<table>";
            sb += "<tr><th>ゼッケン</th><th>部門</th><th>チーム名</th><th></th><th>メンバー</th><th>クラブ</th></tr>";
            for (let i = 1; i < csv.length; i++) {
                let d = csv[i];
                const kana = function(s) {
                    return s.length > 1 ? "(" + s + ")" : "";
                };
                const d2 = [
                    d[0],
                    d[1] === "T" ? "エ" : "歩",
                    d[2],
                    "<button id=btn" + d[0] + ">エントリー</button>",
                    d[3] + kana(d[4]) + (d[6] === "" ? "" : " &amp; " + d[6] + kana(d[7])),
                    d[9],
                ];
                sb += "<tr>";
                for (let j = 0; j < d2.length; j++) {
                    sb += "<td>" + d2[j] + "</td>";
                }
                sb += "</tr>";
            }
            sb += "</table>";
            main.innerHTML = sb;

            for (let i = 1; i < csv.length; i++) {
                const btn = get("btn" + csv[i][0]);
                for(let j = 1; j < register.length; j++) {
                    if (register[j][0] === csv[i][0]) {
                        btn.style.backgroundColor = "red";
                        btn.registerid = csv[i][0];
                    }
                }

                btn.onclick = function() {
                    const entryid = this.id.substring(3);
                    const d = csv[entryid];
                    const btn = this;
                    if (this.style.backgroundColor !== "red") {
                        MiniDB.set("register", [ entryid, new Date().getTime() ].join(","), function(res) {
                            btn.style.backgroundColor = "red";
                            btn.registerid = entryid;
                        });
                    } else {
                        MiniDB.remove("register", btn.registerid, function(res) {
                            btn.style.backgroundColor = "white";
                            btn.registerid = null;
                        });
                    }
                };
            }
        });
    });
};
