import { drawTournament } from "./drawTournament.js";
import { Settings } from "./settings.js";

const AUTO_RELOAD = true;
var autoflg = false;
var category = "T";

window.onload = () => {
    init();
};

const init = () => {
    const hash = document.location.hash;
    if (hash.length > 1) {
        category = hash.substring(1, 2);
        autoflg = hash.charAt(2) == "A";
    }

    MiniDB.load("finalist-" + category, function(finalist) {
        //console.log(finalist)
        if (finalist.length <= 2) {
            alert("決勝トーナメントデータがありません");
            document.location.href = "menu.html";
            return;
        }

        const matchdata = getMatch(Settings.getNumberOfMatch(category)); //category == "T" ? match.m8 : match.m4;
        const title = Settings.getTitle() + "決勝 " + Settings.getGroup(category); // "かにロボコン決勝 " + (category == "T" ? "エントリー部門" : "歩行部門")
        drawTournament(canvas, title, finalist, matchdata, [])

        const dt = 3 * 1000 // 3sec
        let cnt = 0
        const f = function() {
            cnt++;
            if (autoflg && cnt > 3) {
                if (autoflg && category == "K") {
                    window.location.href = "sponsor.html#A";
                    return;
                }
                window.location.href = "tournament.html#" + (category == "T" ? "K" : "T") + "A";
                init();
                return;
            } else {
                MiniDB.load("result2", function(result) {
                    drawTournament(canvas, title, finalist, matchdata, result)
                });
            }
            if (AUTO_RELOAD) {
                setTimeout(f, dt);
            }
        };
        f();
    });
};
