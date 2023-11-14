import {CSV} from "https://js.sabae.cc/CSV.js";
import { Entry } from "./models.ts";

interface miniDBParam {
    fn: string
    cmd: "load" |  "get" |  "set" |  "remove"| "delete" | "create"
    param: {
        id: string
        key: string
        data: string
    }
}

export const minidb = async (fn: any, cmd: any, param: any, db: PicoDB) => {
    const arg = {fn, cmd, param};
    if (cmd == "load") {
        return await db.load(arg)
    } else if (cmd == "get") {
        return await db.get(arg)
    } else if (cmd == "set") {
        return await db.set(arg)
    } else if (cmd == "remove") {
        return await db.remove(arg)
    } else if (cmd == "delete") {
        return await db.delete(arg)
    } else if (cmd == "create") {
        return await db.create(arg)
    }
    return null;
};

export interface PicoDB {
    load(arg: miniDBParam): Promise<any>
    create(arg: miniDBParam): Promise<any>
    get(arg: miniDBParam): Promise<any>
    set(arg: miniDBParam): Promise<any>
    remove(arg: miniDBParam): Promise<any>
    delete(arg: miniDBParam): Promise<any>
}

// export class NanoDB implements PicoDB {
//     private readonly kv: Deno.Kv;
//     private constructor(kv:any) {
//         this.kv = kv;
//     }

//     static async new() {
//         return new NanoDB(await Deno.openKv());
//     }

//     async create(arg: miniDBParam): Promise<any> {
//         return await this.kv.set([arg.param.key], arg.param.data);
//     }

//     async delete(arg: miniDBParam): Promise<any> {
//         return await this.kv.delete([arg.param.key]);
//     }

//     async get(arg: miniDBParam): Promise<any> {
//         return await this.kv.get([arg.param.key]);
//     }

//     async load(arg: miniDBParam): Promise<any> {
//         console.table(arg)
//         const a  = await this.kv.get([arg.param.key]);
//         return Promise.resolve(undefined);
//     }

//     async remove(arg: miniDBParam): Promise<any> {
//         return await this.kv.delete([arg.param.key]);
//     }

//     async set(arg: miniDBParam): Promise<any> {
//         return await this.kv.set([arg.param.key], arg.param.id);
//     }

//     setDefault(): void {
//         DEFAULT_DATA().map(async (d) => {
//             console.log(d.id, d)
//             return await this.kv.set([d.id], d);
//         });
//     }

//     list() {
//         return this.kv.list({prefix: [""]});
//     }

//     async deleteAll() {
//         const list =  this.list();
//         for await (const res of list) {
//             const p = res.value as Entry;
//             await this.kv.delete([p.id]);
//         }
//     }

// }

// 旧MiniDBの移植

export class MiniDB implements PicoDB {
    constructor() {
        console.log("MiniDB")
    }

    async load(arg: miniDBParam) {
        console.table(arg)
        try {
            return await Deno.readTextFile(arg.fn);
        } catch (e) {
            console.log(e)
        }
        return null;
    }

    async get(arg: miniDBParam) {
        console.table(arg)

        const id = arg.param.id;
        const csv = await CSV.fetch(arg.fn);
        for (let i = 1; i < csv.length; i++) {
            if (csv[i][0] === id) {
                return csv[i].join(",");
            }
        }
        return id.toString();
    }

    async set(arg: miniDBParam) {
        // [id, createdAt]
        const ss = arg.param.data.split(",");
        const id = arg.param.id || ss[0];

        const csv = await CSV.fetch(arg.fn);
        for (let i = 1; i < csv.length; i++) {
            if (csv[i][0] === id) {
                csv[i] = ss;
                await Deno.writeTextFile(arg.fn, CSV.encode(csv));
                return 1;
            }
        }
        csv.push(ss);
        await Deno.writeTextFile(arg.fn, CSV.encode(csv));
        return 1;
    }

    async remove(arg: miniDBParam) {
        const id = arg.param.id;
        // console.log("remove", id, arg.fn, arg.param);
        console.table(arg)
        const csv = await CSV.fetch(arg.fn);
        for (let i = 1; i < csv.length; i++) {
            if (csv[i][0] === id) {
                csv.splice(i, 1);
                await Deno.writeTextFile(arg.fn, CSV.encode(csv));
                return 1;
            }
        }
        return 1;
    }

    async delete(arg: miniDBParam) {
        console.table(arg)
        try {
            await Deno.remove(arg.fn);
            return 1;
        } catch (e) {
            console.log(e)
        }
        return 0;
    }

    async create(arg: miniDBParam) {
        console.table(arg)
        await Deno.writeTextFile(arg.fn, arg.param.data);
        return 1;
    }
}

const DEFAULT_DATA = (): Entry[] => {
    return [...Array(30)].map((_, i) => {
        return {
            id: i.toString(),
            category: "T",
            teamName: "カニロボ"+i,
            name: "",
            kana: "",
            school: "",
            club: ""
        }
    })
}
