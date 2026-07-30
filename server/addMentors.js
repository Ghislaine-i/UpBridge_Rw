require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function run() {
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_PORT) || 3306;
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'upbridge_rwanda';

    const connection = await mysql.createConnection({ host, port, user, password, database });

    const mentors = [
        {
            fullName: 'Alice Niyomugabo',
            email: 'alice.niyo@example.com',
            headline: 'Senior Frontend Engineer',
            bio: 'I love helping juniors get their first tech job.',
            location: 'Kigali, Rwanda',
            expertise: 'React & Frontend',
            company: 'Awesomity Lab',
            yearsExperience: 5,
        },
        {
            fullName: 'Jean Claude Tuyisenge',
            email: 'jean.claude@example.com',
            headline: 'Data Scientist & AI Researcher',
            bio: 'Data enthusiast deeply involved in the Kigali AI ecosystem.',
            location: 'Kigali, Rwanda',
            expertise: 'Data Science',
            company: 'Zipline',
            yearsExperience: 4,
        },
        {
            fullName: 'Grace Ingabire',
            email: 'grace.inga@example.com',
            headline: 'Product Designer',
            bio: 'Crafting user-centered experiences for African products.',
            location: 'Kigali, Rwanda',
            expertise: 'UI/UX Design',
            company: 'Irembo',
            yearsExperience: 6,
        }
    ];

    const passHash = await bcrypt.hash('Mentor@123', 10);

    for (const m of mentors) {
        const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [m.email]);
        if (existing.length === 0) {
            const [res] = await connection.query(
                `INSERT INTO users (full_name, email, password_hash, role, headline, bio, location) VALUES (?, ?, ?, 'mentor', ?, ?, ?)`,
                [m.fullName, m.email, passHash, m.headline, m.bio, m.location]
            );

            const userId = res.insertId;
            await connection.query(
                `INSERT INTO mentors (user_id, expertise, company, years_experience) VALUES (?, ?, ?, ?)`,
                [userId, m.expertise, m.company, m.yearsExperience]
            );
            console.log('Inserted mentor:', m.fullName);
        }
    }

    await connection.end();
}

run().catch(console.error);
