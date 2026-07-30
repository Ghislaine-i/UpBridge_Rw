-- Sample job & internship opportunities
USE upbridge_rwanda;

INSERT INTO opportunities (title, company_name, type, location, work_mode, description, requirements, salary_range, category, deadline, is_active) VALUES
('Frontend Developer Intern', 'Kigali Digital Labs', 'internship', 'Kigali', 'hybrid', 'Join our product team to build React interfaces for clients across East Africa.', 'HTML, CSS, JavaScript basics; currently enrolled in a tech programme.', 'Stipend provided', 'Web Development', DATE_ADD(CURDATE(), INTERVAL 30 DAY), TRUE),
('Junior Full-Stack Developer', 'Rwanda Tech Hub', 'job', 'Kigali', 'onsite', 'Build and maintain web applications using React and Node.js for startup clients.', '1+ year experience or strong portfolio; React and Node.js knowledge.', 'RWF 800,000 – 1,200,000', 'Web Development', DATE_ADD(CURDATE(), INTERVAL 45 DAY), TRUE),
('Data Analyst Intern', 'Bank of Kigali', 'internship', 'Kigali', 'onsite', 'Support the analytics team with SQL reporting and dashboard creation.', 'SQL and Excel; interest in finance and data.', 'Competitive stipend', 'Data', DATE_ADD(CURDATE(), INTERVAL 21 DAY), TRUE),
('UI/UX Design Intern', 'Creative Rwanda', 'internship', 'Remote', 'remote', 'Design user flows and prototypes for mobile and web products.', 'Figma experience; portfolio of design work.', 'Unpaid / certificate', 'Design', DATE_ADD(CURDATE(), INTERVAL 60 DAY), TRUE),
('DevOps Engineer', 'CloudAfrica', 'job', 'Kigali', 'hybrid', 'Manage CI/CD pipelines and cloud infrastructure on AWS.', 'Docker, Linux, CI/CD experience; AWS certification a plus.', 'RWF 1,500,000+', 'DevOps', DATE_ADD(CURDATE(), INTERVAL 40 DAY), TRUE),
('Cybersecurity Analyst', 'SecureNet Rwanda', 'job', 'Kigali', 'onsite', 'Monitor security systems and conduct vulnerability assessments.', 'Security fundamentals; network knowledge.', 'RWF 1,000,000 – 1,400,000', 'Security', DATE_ADD(CURDATE(), INTERVAL 35 DAY), TRUE);
