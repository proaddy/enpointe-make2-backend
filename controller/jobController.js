const jobModel = require("../models/jobModel");
const validate = require("../utils/validate");

exports.create_job = async (req, res) => {
    // validating req.body
    const { error, value } = validate.validateCreateJob(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map((detail) => ({
                field: detail.path[0],
                message: detail.message,
            })),
        });
    }

    try {
        const result = await jobModel.create_job(value);
        res.status(200).json({
            success: true,
            output: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create job",
            error: error.message,
        });
    }
};

function paginated_results(data, page_number, items_per_page) {
    page_number = Math.max(1, page_number); // ensuring page remains atleast 1

    // calculate start and end indices
    const start_index = (page_number - 1) * items_per_page;
    const end_index = start_index + items_per_page;

    // get item for the current page
    const paginated_data = data.slice(start_index, end_index);

    // calculate total number of pages
    const total_items = data.length;
    const total_pages = Math.ceil(total_items / items_per_page);

    const metadata = {
        current_page: page_number,
        items_per_page: items_per_page,
        total_items: total_items,
        total_pages: total_pages,
        has_previous: page_number > 1,
        has_next: page_number < total_pages,
        previous_page: page_number > 1 ? page_number - 1 : null,
        next_page: page_number < total_pages ? page_number + 1 : null,
    };

    return {
        data: paginated_data,
        "meta-data": metadata,
    };
}

exports.get_all_jobs = async (req, res) => {
    try {
        const allJobs = await jobModel.get_all_jobs();

        const page_number = parseInt(req.query["page_number"]) || 1;
        const items_per_page = parseInt(req.query["items_per_page"]) || 10;

        const paginated_data = paginated_results(
            allJobs,
            page_number,
            items_per_page
        );

        res.status(200).json({
            success: true,
            count: allJobs.length,
            jobs: paginated_data,
        });
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs",
            error: error.message,
        });
    }
};

exports.update_job = async (req, res) => {
    try {
        const id = req.params.id;

        const existingJob = await jobModel.get_job_by_id(id);
        if (!existingJob) {
            res.status(404).json({
                success: false,
                message: `No job found with id ${id}`,
            });
        }

        const { error, value } = validate.validateUpdateJob(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.details.map((detail) => ({
                    field: detail.path[0],
                    message: detail.message,
                })),
            });
        }

        const updatedJob = await jobModel.update_job(value, id);
        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updatedJob,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update job",
            error: error.message,
        });
    }
};

exports.get_job_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const job = await jobModel.get_job_by_id(id);

        if (!job) {
            res.status(404).json({
                success: false,
                message: `No job with id ${id} found`,
            });
        }
        res.status(200).json({
            success: true,
            message: `Fetching job with id ${id}`,
            job: job,
        });
    } catch (error) {
        console.error("Controller error: ", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch job",
            error: error.message,
        });
    }
};

exports.delete_job = async (req, res) => {
    try {
        const id = req.params.id;
        const existingJob = await jobModel.get_job_by_id(id);

        if (!existingJob) {
            res.status(404).json({
                success: false,
                message: `No job with id ${id}`,
            });
        }

        const job = await jobModel.delete_job(id);

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
            job: job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete job",
            error: error.message,
        });
    }
};
