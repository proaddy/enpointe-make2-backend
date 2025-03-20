const jobModel = require('../models/jobModel')

exports.create_job = async(req, res) => {
    // console.log(req);
    const result = await jobModel.create_job(req.body);
    res.json({
        result: result
    })
}