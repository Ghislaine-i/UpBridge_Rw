/**
 * setupDb.js — One-time database initialisation script.
 * Reads DB credentials from .env, creates the database if needed,
 * runs schema.sql, then seeds courses and opportunities.
 *
 * Usage:
 *   node setupDb.js
 *   node setupDb.js --force   (drops & recreates all tables — DESTRUCTIVE)
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const FORCE = process.argv.includes('--force');

async function setupDatabase() {
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_PORT) || 3306;
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'upbridge_rwanda';

    console.log(`\n📦  UpBridge Rwanda — Database Setup`);
    console.log(`   Host     : ${host}:${port}`);
    console.log(`   User     : ${user}`);
    console.log(`   Database : ${database}\n`);

    let connection;
    try {
        console.log('🔌  Connecting to MySQL…');
        connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
            multipleStatements: true,
        });
        console.log('✅  Connected.\n');

        // ── Create database ──────────────────────────────────────────────────────
        if (FORCE) {
            console.log(`⚠️   --force flag detected. Dropping database "${database}"…`);
            await connection.query(`DROP DATABASE IF EXISTS \`${database}\`;`);
            console.log('   Dropped.\n');
        }

        console.log(`🗄️   Creating database "${database}" (if not exists)…`);
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
        );
        await connection.query(`USE \`${database}\`;`);
        console.log('   OK.\n');

        // ── Schema ───────────────────────────────────────────────────────────────
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        console.log(`📄  Running schema: ${schemaPath}`);
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Strip the CREATE DATABASE / USE statements (already handled above)
        const cleanSchema = schema
            .replace(/CREATE DATABASE.*?;/gis, '')
            .replace(/USE\s+\S+;/gi, '');

        await connection.query(cleanSchema);
        console.log('✅  Schema applied.\n');

        // ── Seed courses ─────────────────────────────────────────────────────────
        const [existingCourses] = await connection.query('SELECT COUNT(*) AS cnt FROM courses;');
        if (existingCourses[0].cnt > 0 && !FORCE) {
            console.log(`ℹ️   Courses table already has ${existingCourses[0].cnt} rows — skipping seed. Use --force to re-seed.\n`);
        } else {
            const seedPath = path.join(__dirname, 'database', 'seed_courses.sql');
            console.log(`🌱  Running courses seed: ${seedPath}`);
            const seeds = fs.readFileSync(seedPath, 'utf8');
            const cleanSeed = seeds.replace(/USE\s+\S+;/gi, '');
            await connection.query(cleanSeed);
            console.log('✅  Course seed data inserted.\n');
        }

        // ── Seed opportunities ───────────────────────────────────────────────────
        const [existingOpps] = await connection.query('SELECT COUNT(*) AS cnt FROM opportunities;');
        if (existingOpps[0].cnt > 0 && !FORCE) {
            console.log(`ℹ️   Opportunities table already has ${existingOpps[0].cnt} rows — skipping seed. Use --force to re-seed.\n`);
        } else {
            const oppSeedPath = path.join(__dirname, 'database', 'seed_opportunities.sql');
            console.log(`🌱  Running opportunities seed: ${oppSeedPath}`);
            const oppSeeds = fs.readFileSync(oppSeedPath, 'utf8');
            const cleanOppSeed = oppSeeds.replace(/USE\s+\S+;/gi, '');
            await connection.query(cleanOppSeed);
            console.log('✅  Opportunity seed data inserted.\n');
        }

        // ── Create default admin user ────────────────────────────────────────────
        const [adminRows] = await connection.query(
            `SELECT id FROM users WHERE email = 'admin@upbridge.rw' LIMIT 1;`
        );
        if (adminRows.length === 0) {
            const adminHash = await bcrypt.hash('Admin@1234', 10);
            await connection.query(
                `INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'admin');`,
                ['UpBridge Admin', 'admin@upbridge.rw', adminHash]
            );
            console.log('👤  Default admin user created:');
            console.log('   Email   : admin@upbridge.rw');
            console.log('   Password: Admin@1234\n');
        } else {
            console.log('ℹ️   Admin user already exists — skipping.\n');
        }

        console.log('🎉  Database setup complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌  Database setup failed:');
        console.error('   Code   :', error.code);
        console.error('   Message:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('\n   ➡️  MySQL Server is not running on ' + host + ':' + port);
            console.error('   Start it with: net start MySQL80  (or your service name)\n');
        }
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();
