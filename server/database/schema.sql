-- ============================================================
-- UpBridge Rwanda - MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS upbridge_rwanda
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE upbridge_rwanda;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'mentor', 'admin') NOT NULL DEFAULT 'student',
  avatar_url VARCHAR(500) DEFAULT NULL,
  headline VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  location VARCHAR(150) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- COURSES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  instructor_name VARCHAR(150) DEFAULT NULL,
  duration_hours DECIMAL(5,1) DEFAULT 0,
  thumbnail_url VARCHAR(500) DEFAULT NULL,
  rating DECIMAL(2,1) DEFAULT 0.0,
  students_enrolled INT DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tracks a student's progress through a course
CREATE TABLE IF NOT EXISTS course_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  progress_percent INT NOT NULL DEFAULT 0,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PROJECTS (Student Portfolio)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  github_link VARCHAR(500) DEFAULT NULL,
  live_demo_link VARCHAR(500) DEFAULT NULL,
  technologies_used VARCHAR(500) DEFAULT NULL COMMENT 'Comma-separated list',
  cover_image_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- MENTORS
-- Extends a `users` row (role = 'mentor') with mentor-specific data
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mentors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  expertise VARCHAR(255) NOT NULL,
  company VARCHAR(150) DEFAULT NULL,
  years_experience INT DEFAULT 0,
  linkedin_url VARCHAR(500) DEFAULT NULL,
  availability_status ENUM('available', 'busy', 'unavailable') NOT NULL DEFAULT 'available',
  rating DECIMAL(2,1) DEFAULT 0.0,
  sessions_completed INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- OPPORTUNITIES (Internships & Jobs)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS opportunities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  company_logo_url VARCHAR(500) DEFAULT NULL,
  type ENUM('internship', 'job') NOT NULL DEFAULT 'job',
  location VARCHAR(150) DEFAULT NULL,
  work_mode ENUM('onsite', 'remote', 'hybrid') NOT NULL DEFAULT 'onsite',
  description TEXT NOT NULL,
  requirements TEXT DEFAULT NULL,
  salary_range VARCHAR(100) DEFAULT NULL,
  category VARCHAR(100) DEFAULT NULL,
  deadline DATE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  posted_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- APPLICATIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  opportunity_id INT NOT NULL,
  cover_note TEXT DEFAULT NULL,
  resume_url VARCHAR(500) DEFAULT NULL,
  status ENUM('submitted', 'under_review', 'shortlisted', 'rejected', 'accepted') NOT NULL DEFAULT 'submitted',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_application (user_id, opportunity_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- MENTORSHIP SESSIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  mentor_id INT NOT NULL,
  topic VARCHAR(255) DEFAULT NULL,
  scheduled_at DATETIME NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  meeting_link VARCHAR(500) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- INDEXES for common lookups / search & filter
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON mentorship_sessions(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
