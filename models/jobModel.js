const pool = require('./db');

exports.create_job = async (jobDetails) => {
    try {
        const {title, description, showSalary, salaryDetails, location, category, email, vacancies, company, jobType, duration} = jobDetails;

        const result = await pool.query(
            `INSERT INTO job 
            (title, description, show_salary, salary_details, location, category, email, vacancies, company, job_type, duration) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`,
            [title, description, showSalary, salaryDetails, location, category, email, vacancies, company, jobType, duration]
        );
        return result.rows[0];
    } catch (err) {
        console.error("Error creating job: ", err);
        throw err;
    }    
};

exports.update_job = async (updateDetails, jobId) => {
    try {

        const existingJob = await pool.query("SELECT * FROM job WHERE id = $1", [jobId]);
        if (existingJob.rows.length === 0) {
            throw new Error(`No job found with id ${jobId}`);
        }

        const currentJob = existingJob.rows[0];

        const updatedFields = {
            title : updateDetails.title || currentJob.title,
            description : updateDetails.description || currentJob.description,
            show_salary : updateDetails.showSalary !== undefined ?  updateDetails.showSalary === true || updateDetails.showSalary === "true" : currentJob.showSalary,
            salary_details : updateDetails.showSalary === false || updateDetails.showSalary === "false" ? "" : (updateDetails.salaryDetails !== undefined ? updateDetails.salaryDetails : currentJob.salary_details),
            location : updateDetails.location || currentJob.location,
            category : updateDetails.category || currentJob.category,
            email : updateDetails.email || currentJob.email,
            vacancies : updateDetails.vacancies || currentJob.vacancies,
            company : updateDetails.company || currentJob.company,
            job_type : updateDetails.jobType || currentJob.jobType,
            duration : updateDetails.jobType === "Full-time" ? "" : (updateDetails.duration !== undefined ? updateDetails.durection : currentJob.duration)
        };

        const fields = Object.keys(updatedFields); // all undefine keys
        const values = Object.values(updatedFields); // all undefined values

        const setOption = fields.map((field, index) => `${field} = $${index+1}`).join(", "); // creating string of set value=$number

        values.push(jobId);

        const result = await pool.query(
            `UPDATE job SET ${setOption} WHERE id = $${values.length} RETURNING *`,
            values
        );
        
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching jobs: ", error);
        throw error;
    }
};

exports.get_all_jobs = async () => {
    try {
        const result = await pool.query('SELECT * FROM job');
        return result.rows;
    } catch (error) {
        console.error("Error fetching jobs: ", error);
        throw error;
    }
};

exports.get_job_by_id = async (jobId) => {
    try {
        const result = await pool.query("SELECT * FROM job WHERE id = $1", [jobId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching job by ID: ", error);
        throw error;
    }
};

exports.delete_job = async (jobId) => {
    try {
        const result = await pool.query("DELETE FROM job WHERE id = $1", [jobId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error while deleting job");
        throw error;
    }
}