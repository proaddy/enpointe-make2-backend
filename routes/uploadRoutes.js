const express = require("express");
const router = express.Router();

const multer = require("multer");
const uploadController = require("../controller/uploadController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".jpeg", ".png", ".jpg"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error(`Only the following file types are allowed: ${allowedExtensions.join(", ")}`), false); // Reject file
    }
};

// Multer configuration for image
const uploadImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: {fileSize: 5 * 1024 * 1024}, // limit file size to 5MB if needed
});
// Multer configuration for file storage
const upload = multer({ storage: storage });

router.post("/file", upload.single("file"), uploadController.parse_csv);
router.post("/image", uploadImage.single("file"), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "Invalid file type. Please upload a PNG or JPG file." });
    }
    next();
});

module.exports = router;
