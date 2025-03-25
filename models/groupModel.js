const pool = require("./db");

exports.filter_group = async () => {
    try {
        const result = await pool.query(
            `SELECT email, COUNT(*) AS count
            FROM job
            GROUP BY email
            HAVING COUNT(*)>=10;`
        );
        return result.rows;
    } catch (error) {
        console.error("Error while grouping the jobs");
        throw error;
    }
};

exports.filter_group_unique = async () => {
    try {
        const result = await pool.query(
            `WITH EmailGroups AS (
                SELECT email 
                FROM job 
                GROUP BY email 
                HAVING COUNT(*) >= 10
            )
            SELECT DISTINCT title, email
            FROM job 
            WHERE email IN (SELECT email FROM EmailGroups) ORDER BY email;
            `
        );
        return result.rows;
    } catch (error) {
        console.error("Error while fetching unique data");
        throw error;
    }
};
