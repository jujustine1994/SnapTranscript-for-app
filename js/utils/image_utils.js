/**
 * Image Processing Utilities
 * Handles compression, resizing, and cropping for profile avatars.
 */
const ImageUtils = {

    /**
     * Loads an image from a File object
     * @param {File} file 
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage: (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    },

    /**
     * Compresses and resizes an image to fit within max dimensions
     * @param {HTMLImageElement} img 
     * @param {number} maxWidth 
     * @param {number} maxHeight 
     * @param {number} quality (0 to 1)
     * @returns {string} Base64 data URL
     */
    compressImage: (img, maxWidth, maxHeight, quality = 0.7) => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round(height * (maxWidth / width));
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round(width * (maxHeight / height));
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        return canvas.toDataURL('image/jpeg', quality);
    },

    /**
     * Crops an image based on the provided source rect and output size
     * @param {HTMLImageElement} img - Source image
     * @param {object} cropRect - {x, y, width, height} (The area of the source image to capture)
     * @param {number} outputSize - The width/height of the final square result
     * @returns {string} Base64 data URL of cropped image
     */
    cropImage: (img, cropRect, outputSize = 300) => {
        const canvas = document.createElement('canvas');
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext('2d');

        // Draw the slice of the source image into the canvas
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(
            img,
            cropRect.x, cropRect.y, cropRect.width, cropRect.height,
            0, 0, outputSize, outputSize
        );

        return canvas.toDataURL('image/jpeg', 0.8); // High quality for the final avatar
    }
};

window.ImageUtils = ImageUtils;
