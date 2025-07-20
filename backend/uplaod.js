import multer from 'multer';

// Use memory storage
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
