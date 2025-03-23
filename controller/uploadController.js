const fs = require("fs");
const csv = require("csv-parser");
const validate = require("../utils/validate");
const jobModel = require("../models/jobModel")

exports.parse_csv = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const results = [];

        // creating readable data stream
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
                fs.unlinkSync(req.file.path); // deleting the file

                let invalidRecords = [];
                let validRecords = [];
                results.forEach((job) => {
                    const { error, value } = validate.validateCreateJob(job);
                    if (error) {
                        invalidRecords.push({ job: job, error: error });
                    } else {
                        validRecords.push(value);
                    }
                });

                validRecords.forEach(async job => {
                    await jobModel.create_job(job);
                });

                res.status(200).json({
                    success: true,
                    message: "CSV file processed and stored successfully",
                    dataCount: validRecords.length,
                    invalidCount: invalidRecords.length,
                    data: validRecords,
                    invalidRecords: invalidRecords
                });
            })
            .on("error", (error) => {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
