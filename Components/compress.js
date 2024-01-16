function compressPng() {

    const fs = require('fs');
    const imagemin = require('imagemin');
    const imageminPngquant = require('imagemin-pngquant');

    const inputImagePath = 'path/to/your/image.png';

    // Read the image into a buffer
    fs.readFile(inputImagePath, (err, inputImageBuffer) => {
        if (err) {
            console.error('Error reading the input image:', err);
            return;
        }

        // Compress the image buffer
        imagemin.buffer(inputImageBuffer, {
            plugins: [
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        }).then((compressedBuffer) => {
            // Use the compressed buffer as needed
            console.log('Compressed Buffer:', compressedBuffer);

            // Optionally, you can write the compressed buffer to a new file
            fs.writeFile('path/to/your/compressed_image.png', compressedBuffer, (err) => {
                if (err) {
                    console.error('Error writing the compressed image:', err);
                } else {
                    console.log('Image compressed successfully.');
                }
            });
        }).catch((error) => {
            console.error('Error compressing the image:', error);
        });
    });
}

function CompressWebp() {
    const fs = require('fs');
    const imagemin = require('imagemin');
    const imageminWebp = require('imagemin-webp');

    const inputImagePath = 'path/to/your/image.jpg';

    // Read the image into a buffer
    fs.readFile(inputImagePath, (err, inputImageBuffer) => {
        if (err) {
            console.error('Error reading the input image:', err);
            return;
        }

        // Compress the image buffer to WebP format
        imagemin.buffer(inputImageBuffer, {
            plugins: [
                imageminWebp({
                    quality: 75 // Adjust the quality as needed (0 to 100)
                })
            ]
        }).then((compressedBuffer) => {
            // Use the compressed buffer as needed
            console.log('Compressed Buffer:', compressedBuffer);

            // Optionally, you can write the compressed buffer to a new file
            fs.writeFile('path/to/your/compressed_image.webp', compressedBuffer, (err) => {
                if (err) {
                    console.error('Error writing the compressed image:', err);
                } else {
                    console.log('Image compressed to WebP format successfully.');
                }
            });
        }).catch((error) => {
            console.error('Error compressing the image:', error);
        });
    });

}