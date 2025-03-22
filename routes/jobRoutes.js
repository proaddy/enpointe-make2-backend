const express = require('express');
const router = express.Router();
const jobController = require('../controller/jobController');

// console.log("going through routes");
router.post('/create-job', jobController.create_job);
router.get('/jobs', jobController.get_all_jobs);
router.get('/job/:id', jobController.get_job_by_id);
router.put('/update-job/:id', jobController.update_job);
router.delete('/delete-job/:id', jobController.delete_job);

module.exports = router;