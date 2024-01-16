import sharp from "sharp";

export async function getServerSideProps(ctx) {
    let { Image } = require("../Models/Image"),
        { sendRespnonseJson404 } = require('../utils/utils');

    return getImage(ctx, ctx.res);
    async function getImage(req, res) {
        let id = req.query["id"];
        let img = await Image.findOne({ route: id });
        if (!img)
            return sendRespnonseJson404(res, "Not found");
        let stream = require("stream"),
            // compressedBuffer = await imagemin.buffer(img.data, {
            //     plugins: [
            //         imageminPngquant({
            //             quality: [0.6, 0.8]
            //         })
            //     ]
            // });
            data = await sharp(img.data).resize({ width: req.query['width'] || 1920, height: req.query['height'] || 1080, fit: "contain" }).toBuffer()
        let pipeline = stream.Readable.from(Buffer.from(data));
        console.log(data.byteLength)
        pipeline.pipe(res);
        return { props: {} }
    }
}

export default () => {

}