const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'portfolio_db',
    password: 'password',
    port: 5432,
});

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, '../sql/schema.sql');
        console.log('Reading schema from:', schemaPath);
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Connecting to database...');
        const client = await pool.connect();

        console.log('Applying schema...');
        await client.query(schemaSql);

        console.log('Schema applied successfully!');
        client.release();
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await pool.end();
    }
}

initDb();
