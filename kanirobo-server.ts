import { serveAPI } from "https://js.sabae.cc/wsutil.js";
import {minidb, MiniDB, NanoDB} from "./minidb.ts";

const password = (await Deno.readTextFile("password.txt")).trim();
// picoDB.deleteAll()
// picoDB.setDefault();
const fromURLSearchParams = (param) => {
  const p = new URLSearchParams(param);
  const res = {};
  for (const key of p.keys()) {
    res[key] = p.get(key);
  }
  return res;
};
const retJSONP = (callback, obj) => {
  const s = `${callback}(${JSON.stringify(obj)});`;
  return new Response(s, { headers: { "Content-Type": "application/json" } });
};

serveAPI("/api", async (param, req, path, conninfo) => {
  param = fromURLSearchParams(param);
  // if (param.key !== password) {
  //   return null;
  // }
  console.log(param)
  const fn = "data/" + path.substring(5);
  if (fn.indexOf("..") >= 0) {
    return null;
  }
  const cmd = param.cmd;
  const res = await minidb(fn, cmd, param, new MiniDB());
  console.log(res)
  return retJSONP(param.callback, res);
});
