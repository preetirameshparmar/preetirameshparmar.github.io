const fs = require('fs');
const path = require('path');
// node-fetch removed as we use pg client directly

// Since we are in a simple script, let's use standard http if node-fetch isn't available, 
// OR just straightforwardly use the pg client directly to insert.
// Using PG client is better as we don't need to run the server for migration necessarily,
// BUT using the API ensures we test the server endpoints. 
// Let's use the PG client directly for reliability in this script, similar to init-db.js.

const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'portfolio_db',
    password: 'password',
    port: 5432,
});

async function migrate() {
    const publicDir = path.join(__dirname, '../public');
    const files = ['personal.txt', 'education.txt', 'work-experience.txt', 'projects.txt', 'skills.txt', 'web.txt'];

    console.log('Starting migration...');
    const client = await pool.connect();

    try {
        for (const file of files) {
            const filePath = path.join(publicDir, file);
            if (!fs.existsSync(filePath)) {
                console.warn(`File not found: ${file}`);
                continue;
            }

            console.log(`Processing ${file}...`);
            const text = fs.readFileSync(filePath, 'utf8');

            // Parse using the same logic as the Frontend Components (simplified)
            const titleMatch = text.match(/\[Title\]\n(.*?)\n/);
            const orderMatch = text.match(/\[Order\]\n(.*?)\n/);
            const contentMatch = text.match(/\[Content\]\n([\s\S]*)/);

            const title = titleMatch ? titleMatch[1].trim() : file.replace('.txt', '');
            const order = orderMatch ? parseInt(orderMatch[1], 10) : 0;
            let rawContent = contentMatch ? contentMatch[1].trim() : '';

            // For structured data (Education, Projects, etc.), we basically need to store the raw text 
            // or parse it into JSON. 
            // The schema has `content JSONB`. 
            // If we store raw text in a JSON field, it might be weird.
            // Ideally, we should parse it into a JSON object: { raw: "..." } or { items: [...] }
            // For now, to keep strict compatibility with the frontend (which expects to parse .txt),
            // we might want to store the WHOLE .txt file content? 
            // No, the Frontend Abstraction goal implies we move AWAY from .txt parsing in the frontend eventually.
            // BUT, the plan says "Design SQL Schema... mirrors current .txt".
            // Let's store the parsed structure in JSONB.

            // PARSER LOGIC
            let jsonContent = {};

            if (['education.txt', 'work-experience.txt', 'projects.txt'].includes(file)) {

                // Special handling for Work Experience to capture bullets and "On Field work"
                if (file === 'work-experience.txt') {
                    // Logic ported from WorkExperience.js
                    const entries = rawContent.split(/\n\n(?=Start:)/);
                    const items = entries.map(entry => {
                        const lines = entry.split('\n').filter(line => line.trim() !== '');
                        const workEntry = {};
                        let currentField = null;

                        lines.forEach(line => {
                            if (line.includes(': ') && !line.startsWith('•') && !line.startsWith('• ')) {
                                const [key, ...valueParts] = line.split(': ');
                                const value = valueParts.join(': ').trim();
                                const fieldKey = key.trim().toLowerCase().replace(/\s+/g, '_');
                                workEntry[fieldKey] = value;
                                currentField = fieldKey;
                            } else if (line.trim().toLowerCase().startsWith('on field work')) {
                                currentField = 'on_field_work';
                                workEntry[currentField] = '';
                            } else if (line.trim().startsWith('•')) {
                                if (currentField) {
                                    // Append to current field (likely on_field_work)
                                    workEntry[currentField] = (workEntry[currentField] || '') + (workEntry[currentField] ? '\n' : '') + line.trim();
                                }
                            }
                        });
                        return workEntry;
                    });
                    // Sort by start date desc
                    items.sort((a, b) => new Date(b.start || 0) - new Date(a.start || 0));
                    jsonContent = { items };
                }
                // Projects parsing failure fix (if any) or existing logic
                else if (file === 'projects.txt') {
                    // Projects logic (Split by \n\nName:)
                    const entries = rawContent.split(/\n\n(?=Name:)/);
                    const items = entries.map(entry => {
                        const lines = entry.split('\n').filter(line => line.trim() !== '');
                        const projectData = lines.reduce((acc, line) => {
                            const [key, ...valueParts] = line.split(': ');
                            if (key && valueParts.length > 0) {
                                acc[key.trim().toLowerCase().replace(' ', '_')] = valueParts.join(': ').trim();
                            }
                            return acc;
                        }, {});
                        return projectData;
                    });
                    jsonContent = { items };
                }
                else {
                    // Default list parser (Education, Skills if needed)
                    // Education.txt seems line-based but with keys
                    const items = [];
                    const lines = rawContent.split('\n').map(l => l.trim()).filter(l => l);
                    let currentItem = {};
                    lines.forEach(line => {
                        if (line.includes(': ')) {
                            const [key, val] = line.split(': ');
                            const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_');
                            if (cleanKey === 'degree' && Object.keys(currentItem).length > 0) {
                                items.push(currentItem);
                                currentItem = {};
                            }
                            currentItem[cleanKey] = val;
                        }
                    });
                    if (Object.keys(currentItem).length > 0) items.push(currentItem);
                    jsonContent = { items };
                }

            } else if (file === 'personal.txt') {
                // Personal: Content + CTA sections
                // Re-read text to capture [CTA] block
                const ctaMatch = text.match(/\[CTA\]\n([\s\S]*)/);

                // Parse Key-Values from Content
                const lines = rawContent.split('\n');
                lines.forEach(line => {
                    if (line.includes(':')) {
                        const [key, val] = line.split(':');
                        jsonContent[key.trim().toLowerCase()] = val.trim();
                    }
                });

                // Parse CTAs
                if (ctaMatch) {
                    const ctaLines = ctaMatch[1].split('\n').filter(l => l.trim().startsWith('-'));
                    jsonContent['cta_buttons'] = ctaLines.map(line => {
                        const match = line.match(/^- (.*?) - (https?:\/\/.*)/);
                        if (match) return { label: match[1].trim(), url: match[2].trim() };
                        return null;
                    }).filter(Boolean);
                }
            } else {
                // Default
                jsonContent = { raw: rawContent };
            }

            // Upsert into DB
            // Type mapping
            let type = 'text';
            if (file === 'education.txt') type = 'education';
            if (file === 'work-experience.txt') type = 'experience';
            if (file === 'projects.txt') type = 'project';
            if (file === 'skills.txt') type = 'skills'; // Assuming mixed or list
            if (file === 'web.txt') type = 'links';
            if (file === 'personal.txt') type = 'personal';

            const query = `
        INSERT INTO sections (type, title, content, "order", is_visible)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE 
        SET content = $3, updated_at = NOW()`;
            // Note: we don't have a unique constraint on title/type yet, so upsert might not work 
            // if using ON CONFLICT without a unique key.
            // For migration, let's just INSERT.
            // Better: DELETE existing of this type to avoid dupes during re-runs?

            await client.query('DELETE FROM sections WHERE type = $1', [type]);
            await client.query(
                'INSERT INTO sections (type, title, content, "order", is_visible) VALUES ($1, $2, $3, $4, $5)',
                [type, title, JSON.stringify(jsonContent), order, true]
            );

            console.log(`Migrated ${file} as ${type}`);
        }
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
