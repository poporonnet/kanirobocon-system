import { CSV } from "https://code4sabae.github.io/js/CSV.js";

const rnd = (n) => {
    return Math.floor(Math.random() * n);
};
const shuffle = (array) => {
    for (let i = 0; i < array.length; i++) {
        const n = rnd(array.length);
        const tmp = array[i];
        array[i] = array[n];
        array[n] = tmp;
    }
};

window.onload = async () => {
    const hash = document.location.hash;
    if (hash.length > 1) {
        const autoflg = hash.charAt(1) === "A";
        if (autoflg) {
            setTimeout(() => {
                window.location.href = "tournament.html#TA";
            }, 3000);
        }
    }

    const csv = CSV.decode(await (await fetch("sponsor.csv")).text());
    const json = CSV.toJSON(csv);

    // セイコスポンサーは出現確率を倍に
    for (let i = json.length - 1; i >= 0; i--) {
        if (json[i].rank === "seiko") {
            json.push(json[i]);
            //json.push(json[i]);
        }
    }

    const show = () => {
        document.body.innerHTML = "";

        // まぜながら表示
        for (let j = 0; j < 4; j++) {
            shuffle(json);
            for (let i = 0; i < json.length; i++) {
                const img = new Image();
                img.src = json[i].img;
                document.body.appendChild(img);
            }
        }
    };
    show();
    setInterval(show, 15 * 1000);
};
