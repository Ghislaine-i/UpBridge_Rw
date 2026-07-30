-- ============================================================
-- UpBridge Rwanda - Sample Seed Data: Courses
-- Run this AFTER schema.sql has created the database and tables.
-- ============================================================

USE upbridge_rwanda;

INSERT INTO courses (title, description, category, level, instructor_name, duration_hours, thumbnail_url, rating, students_enrolled, is_published) VALUES
('HTML & CSS Fundamentals', 'Learn the building blocks of the web: semantic HTML, layouts, Flexbox, and Grid, by building real pages from scratch.', 'Web Development', 'Beginner', 'Eric Mugisha', 8.0, 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600', 4.7, 1240, TRUE),
('JavaScript Essentials', 'Master core JavaScript: variables, functions, arrays, objects, DOM manipulation, and asynchronous programming.', 'Web Development', 'Beginner', 'Aline Uwimana', 12.0, 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600', 4.8, 1530, TRUE),
('React Development', 'Build modern, component-based user interfaces with React, hooks, and React Router.', 'Web Development', 'Intermediate', 'Jean Paul Habimana', 15.0, 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600', 4.9, 980, TRUE),
('Node.js & Express', 'Build fast, scalable backend APIs using Node.js, Express, and RESTful design principles.', 'Web Development', 'Intermediate', 'Eric Mugisha', 14.0, 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600', 4.6, 760, TRUE),
('MySQL Database Design', 'Design relational databases, write efficient SQL queries, and model real-world data.', 'Data', 'Intermediate', 'Claudine Mukamana', 10.0, 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600', 4.5, 640, TRUE),
('Python Programming', 'A hands-on introduction to Python covering syntax, data structures, and problem solving.', 'Programming', 'Beginner', 'Patrick Nshimiyimana', 11.0, 'https://images.unsplash.com/photo-152637995098-d400fd0bf935?w=600', 4.7, 1120, TRUE),
('Git & GitHub', 'Learn version control from the ground up: commits, branches, pull requests, and team workflows.', 'Tools', 'Beginner', 'Aline Uwimana', 5.0, 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600', 4.6, 890, TRUE),
('Cybersecurity Basics', 'Understand common threats, safe coding practices, and how to protect applications and data.', 'Security', 'Beginner', 'Eric Mugisha', 9.0, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600', 4.4, 410, TRUE),
('Artificial Intelligence Fundamentals', 'Explore the core concepts behind AI and machine learning, and how they are applied today.', 'Data', 'Intermediate', 'Diane Ingabire', 13.0, 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600', 4.8, 700, TRUE),
('UI/UX Design', 'Learn user-centered design principles, wireframing, prototyping, and usability testing.', 'Design', 'Beginner', 'Grace Umutoni', 10.0, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600', 4.7, 820, TRUE),
('Professional Communication', 'Build the communication skills employers value: writing, presenting, and workplace etiquette.', 'Career Skills', 'Beginner', 'Grace Umutoni', 6.0, 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600', 4.5, 950, TRUE),
('Career Readiness', 'Prepare your CV, LinkedIn profile, and interview skills to land your first internship or job.', 'Career Skills', 'Beginner', 'Patrick Nshimiyimana', 7.0, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600', 4.9, 1670, TRUE);
