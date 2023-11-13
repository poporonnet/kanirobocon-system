import {Settings} from "./settings.js";

window.onload = function () {
    title.textContent = Settings.getTitle() + " データクリア";

    btnentry.onclick = function () {
        if (confirm("エントリーデータを削除しますか？（戻せません）")) {
            MiniDB.del("register", function (res) {
            });
        }
    };
    btnmatch1.onclick = function () {
        if (confirm("予選対戦表データを削除しますか？（戻せません）")) {
            MiniDB.del("match1", function (res) {
            });
        }
    };
    btnresult1.onclick = function () {
        if (confirm("予選対戦結果データを削除しますか？（戻せません）")) {
            MiniDB.del("result1", function (res) {
                MiniDB.create("result1", "match1id,category,entry1id,entry2id,score1,score2,time1,time2,flg1,flg2", function (res) {
                });
            });
        }
    };
    btnmatch2.onclick = function () {
        if (confirm("決勝対戦表データを削除しますか？（戻せません）")) {
            MiniDB.del("match2", function (res) {
                MiniDB.del("finalist-T", function (res) {
                    MiniDB.del("finalist-K", function (res) {
                    });
                });
            });
        }
    };
    btnresult2.onclick = function () {
        if (confirm("決勝対戦結果データを削除しますか？（戻せません）")) {
            MiniDB.del("result2", function (res) {
                MiniDB.create("result2", "match2id,category,entry1id,entry2id,score1,score2,time1,time2,flg1,flg2", function (res) {
                });
            });
        }
    };
    //
    if (window.btnreset) {
        btnreset.onclick = function () {
            if (confirm("参加者を含む、全データを初期化しますか？（戻せません）")) {
                MiniDB.del("entry", function (res) {
                    MiniDB.create("entry", "id,category,teamname,name1,kana1,school1,name2,kana2,school2,club", function (res) {
                        MiniDB.del("register", function (res) {
                            MiniDB.create("register", "entryid,datetime", function (res) {
                                MiniDB.del("match1", function (res) {
                                    MiniDB.del("result1", function (res) {
                                        MiniDB.create("result1", "match1id,category,entry1id,entry2id,score1,score2,time1,time2,flg1,flg2", function (res) {
                                            MiniDB.del("match2", function (res) {
                                                MiniDB.del("finalist-T", function (res) {
                                                    MiniDB.del("finalist-K", function (res) {
                                                        MiniDB.del("result2", function (res) {
                                                            MiniDB.create("result2", "match2id,category,entry1id,entry2id,score1,score2,time1,time2,flg1,flg2", function (res) {
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
        };
    }
};
