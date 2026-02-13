const { Pool } = require('pg');
require('dotenv').config({ path: 'backend/.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function listFreelancers() {
    try {
        const res = await pool.query("SELECT id, email, role FROM users WHERE role = 'freelancer'");
        console.log('Freelancers:');
        res.rows.forEach(row => {
            console.log(`- ID: ${row.id} | Email: ${row.email}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

listFreelancers();
