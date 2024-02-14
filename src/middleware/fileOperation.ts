import multer from "multer";
const storage = multer.memoryStorage()

const maxSize = 20 * 1024 * 1024;

export const upload = multer({
    storage: storage,
    limits: {fileSize: maxSize}
})
console.log('here');

