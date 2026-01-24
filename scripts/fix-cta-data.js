const { Pool } = require('pg');
require('dotenv').config({ path: '../server/.env' }); // Load env from server/

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'portfolio_db',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: process.env.POSTGRES_PORT || 5432,
});

async function fixData() {
    try {
        console.log("Fetching 'project' sections...");
        const res = await pool.query("SELECT * FROM sections WHERE type = 'project'");

        if (res.rows.length === 0) {
            console.log("No project sections found.");
            return;
        }

        for (const section of res.rows) {
            let content = section.content;
            let modified = false;

            if (content && content.items && Array.isArray(content.items)) {
                content.items = content.items.map(item => {
                    if (item.cta && item.cta.includes(': ')) {
                        const parts = item.cta.split(': ');
                        // If it looks like "Label: ./assets...", keep just the Label
                        if (parts.length > 1) {
                            console.log(`Fixing CTA: "${item.cta}" -> "${parts[0]}"`);
                            item.cta = parts[0];
                            modified = true;
                        }
                    }
                    return item;
                });
            }

            if (modified) {
                console.log(`Updating section ${section.id}...`);
                await pool.query('UPDATE sections SET content = $1 WHERE id = $2', [JSON.stringify(content), section.id]);
                console.log("Saved.");
            } else {
                console.log(`Section ${section.id} needed no changes.`);
            }
        }

        console.log("Done.");
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

fixData();
