const pool = require('./db');

exports.create_job = async (jobDetails) => {
    try {
        const {
            title, 
            description, 
            showSalary,
            salaryDetails,
            location, 
            category, 
            email,
            vacancies,
            company,
            jobType,
            duration
        } = jobDetails;
        
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
    
}