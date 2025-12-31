/**
 * Image compression and validation utilities for event posters
 */

// Maximum file size in bytes (2MB)
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

// Compressed image quality (0.1 - 1.0)
export const COMPRESSION_QUALITY = 0.7;

// Maximum compressed dimensions
export const MAX_WIDTH = 1200;
export const MAX_HEIGHT = 800;

/**
 * Compress an image file using canvas
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<string>} - Base64 encoded compressed image
 */
export const compressImage = (file, options = {}) => {
    const {
        maxWidth = MAX_WIDTH,
        maxHeight = MAX_HEIGHT,
        quality = COMPRESSION_QUALITY,
        mimeType = 'image/jpeg'
    } = options;

    return new Promise((resolve, reject) => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            reject(new Error('File must be an image'));
            return;
        }

        // Check file size
        if (file.size > MAX_IMAGE_SIZE) {
            reject(new Error(`Image size must be less than ${formatFileSize(MAX_IMAGE_SIZE)}`));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (maxHeight / height) * width;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress and convert to base64
                const compressedDataUrl = canvas.toDataURL(mimeType, quality);
                
                // Calculate compressed size
                const base64Length = compressedDataUrl.split(',')[1].length;
                const compressedSize = Math.round((base64Length * 3) / 4);

                console.log(`Original: ${formatFileSize(file.size)} → Compressed: ${formatFileSize(compressedSize)}`);
                resolve(compressedDataUrl);
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
    });
};

/**
 * Validate image file before upload
 * @param {File} file - The image file to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validateImage = (file) => {
    // Check if file exists
    if (!file) {
        return { isValid: false, message: 'Please select an image file' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return { 
            isValid: false, 
            message: 'Invalid file type. Allowed: JPG, PNG, GIF, WEBP' 
        };
    }

    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
        return { 
            isValid: false, 
            message: `File too large. Maximum size is ${formatFileSize(MAX_IMAGE_SIZE)}` 
        };
    }

    return { isValid: true, message: 'Image is valid' };
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size string
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get image size from base64 string
 * @param {string} base64 - Base64 encoded image
 * @returns {number} - Approximate size in bytes
 */
export const getBase64Size = (base64) => {
    const base64Length = base64.split(',')[1].length;
    return Math.round((base64Length * 3) / 4);
};

/**
 * Create a thumbnail from base64 image
 * @param {string} base64 - Base64 encoded image
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @returns {Promise<string>} - Base64 encoded thumbnail
 */
export const createThumbnail = (base64, width = 200, height = 150) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
            resolve(thumbnail);
        };

        img.onerror = () => {
            reject(new Error('Failed to create thumbnail'));
        };
    });
};

