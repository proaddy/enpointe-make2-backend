const express = require('express');
const router = express.Router();
const jobController = require('../controller/jobController');

// console.log("going through routes");
router.post('/create-job', jobController.create_job);

module.exports = router;