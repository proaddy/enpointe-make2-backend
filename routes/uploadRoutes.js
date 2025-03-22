const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
const uploadController = require("../controller/uploadController");

router.post("/file", upload.single("file"), uploadController.parse_csv);
// router.post('/image', uploadController);

module.exports = router;
