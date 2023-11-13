// import {xxhash} from "https://unpkg.com/xxhash-wasm/xxhash-wasm.js";

window.onload = function () {
    btn.onclick = async function () {
        // const {h32, h64} = await xxhash()
        // const hashedid = h64(inputid.value.toLowerCase()).toString(16)
        // if (hashedid !== "93cd62db80be1e79") {
        //     alert("ID / パスワードが違います");
        //     return;
        // }
        localStorage.setItem("key", inputpw.value);
        window.location.href = "menu.html";
    };
};
