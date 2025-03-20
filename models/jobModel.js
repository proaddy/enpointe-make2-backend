const pool = require('./db')

exports.create_job = async (jobDetails) => {
    const {title, description, salary, location, category, vacancies} = jobDetails;
    const result = await pool.query(
        'INSERT INTO job (title, description, salary, location, category, vacancies) VALUES ($1, $2, $3, $4, $5, $6)',
        [title, description, salary, location, category, vacancies]
    );
    return result;
}