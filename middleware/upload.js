// import multer from "multer";
// import path from "path";

// // Storage config
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, "uploads/aadhar/");
//     },
//     filename(req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// // File type validation (optional)
// function checkFileType(file, cb) {
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
//     if (extname && mimetype) return cb(null, true);
//     else cb("Error: Images Only!");
// }

// export const upload = multer({
//     storage,
//     fileFilter: function (req, file, cb) {
//         checkFileType(file, cb);
//     },
// });

import multer from "multer";

const storage = multer.memoryStorage(); // ✅ store in memory instead of disk

export const upload = multer({ storage });