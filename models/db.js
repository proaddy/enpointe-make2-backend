const { Pool } = require("pg");

let pool;


if (process.env.DB_URL) {
    pool = new Pool({
        // making new connection
        connectionString: process.env.DB_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
} else {
    // Fallback to individual parameters
    pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false,
        },
    });
}

// Test connection
pool.connect()
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch((err) => console.error("Database connection failed:", err));

module.exports = pool;
