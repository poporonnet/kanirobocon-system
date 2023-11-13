import {Settings} from "../lib/settings.js";

window.onload = function () {
    title.textContent = Settings.getTitle() + " 得点システム";
};
