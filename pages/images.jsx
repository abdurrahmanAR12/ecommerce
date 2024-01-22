import sharp from "sharp";
import imagemin from "imagemin"
import imageminPngquant from "imagemin-pngquant"
import imageminWebp from "imagemin-webp"


export async function getServerSideProps(ctx) {
    let { Image } = require("../Models/Image"),
        { sendRespnonseJson404 } = require('../utils/utils');

    return getImage(ctx, ctx.res);
    async function getImage(req, res) {
        let id = req.query["id"],
            width = parseInt(req.query['width']),
            height = parseInt(req.query['height']);
        let img = await Image.findOne({ route: id });
        if (!img)
            return sendRespnonseJson404(res, "Not found");
        let stream = require("stream"),
            compressedBuffer = await imagemin.buffer(img.data, {
                plugins: [
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    }),
                    imageminWebp()
                ]
            }),
            data = await sharp(compressedBuffer).webp().resize({ width: width || 1920, height: height || 1080, fit: "fill" }).toBuffer()
        let pipeline = stream.Readable.from(Buffer.from(data));

        // console.log(data.byteLength)
        // res['contentType'] = "image/webp";
        // console.log(res)
        pipeline.pipe(res);
        return { props: {} }
    }
}

export default () => {

}