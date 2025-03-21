const jobModel = require('../models/jobModel')
const validate = require("../utils/validate")

exports.create_job = async(req, res) => {
    // validating req.body
    const {error, value} = validate.validateCreateJob(req.body);

    if(error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }))
        });
    }

    try {
        const result = await jobModel.create_job(req.body);
        res.status(200).json({
            success: true,
            output: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create job",
            error: error.message
        })
    }
}