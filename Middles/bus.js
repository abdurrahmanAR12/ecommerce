import busboy from "busboy";

export function bus(req) {
    return new Promise((resolve, reject) => {
        let fP = busboy({ headers: req.headers });
        let fs = {}, files = {};

        fP.on("field", (n, v, info) => {
            fs[n] = v;
        });

        fP.on("file", (name, s, info) => {
            let d = Buffer.alloc(0)
            s.on("data", ch => d = Buffer.concat([d, ch])).on("end", () => {
                files[name] = { data: d, ...info };
            });
        });

        fP.on("error", e => {
            reject(e);
        });

        req.pipe(fP);

        return fP.on("finish", async () => {
            if (Object.keys(files).length)
                req.files = files;
            req.body = fs;
            resolve(true);
        });
    });
}
