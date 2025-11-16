-- FOREIGN KEYS FOR INTERNSHIPS
ALTER TABLE internships 
    ADD CONSTRAINT fk_internship_mentor 
    FOREIGN KEY (mentor_id) REFERENCES users(user_id)
    ON DELETE SET NULL;

-- FOREIGN KEYS FOR PROJECTS
ALTER TABLE projects 
    ADD CONSTRAINT fk_project_mentor
    FOREIGN KEY (mentor_id) REFERENCES users(user_id)
    ON DELETE SET NULL;

-- FOREIGN KEYS FOR APPLICATIONS
ALTER TABLE applications 
    ADD CONSTRAINT fk_application_student 
    FOREIGN KEY (student_id) REFERENCES users(user_id)
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_application_internship 
    FOREIGN KEY (internship_id) REFERENCES internships(internship_id)
    ON DELETE CASCADE;

-- FOREIGN KEYS FOR TEAM
ALTER TABLE team 
    ADD CONSTRAINT fk_team_project 
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_team_student 
    FOREIGN KEY (student_id) REFERENCES users(user_id)
    ON DELETE CASCADE;

-- FOREIGN KEYS FOR TASKS
ALTER TABLE tasks 
    ADD CONSTRAINT fk_task_project 
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_task_user 
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
    ON DELETE CASCADE;

-- FOREIGN KEYS FOR RESOURCES
ALTER TABLE resources 
    ADD CONSTRAINT fk_resource_project 
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_resource_user 
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
    ON DELETE SET NULL;


-- =========================================================
-- DATABASE SCHEMA FOR internship_portal
-- Using ON DELETE SET NULL for all relationships
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- USERS TABLE
-- =========================================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'mentor', 'admin') NOT NULL,
    skills TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- INTERNSHIPS TABLE
-- =========================================================
DROP TABLE IF EXISTS internships;
CREATE TABLE internships (
    internship_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    company_name VARCHAR(150),
    duration INT,
    start_date DATE,
    end_date DATE,
    mentor_id INT,
    FOREIGN KEY (mentor_id) REFERENCES users(user_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- PROJECTS TABLE
-- =========================================================
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    start_date DATE,
    end_date DATE,
    mentor_id INT,
    FOREIGN KEY (mentor_id) REFERENCES users(user_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- APPLICATIONS TABLE
-- =========================================================
DROP TABLE IF EXISTS applications;
CREATE TABLE applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    internship_id INT,
    status ENUM('applied', 'accepted', 'rejected'),
    FOREIGN KEY (student_id) REFERENCES users(user_id)
        ON DELETE SET NULL,
    FOREIGN KEY (internship_id) REFERENCES internships(internship_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- TEAM TABLE
-- =========================================================
DROP TABLE IF EXISTS team;
CREATE TABLE team (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    student_id INT,
    role_in_team VARCHAR(100),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
        ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES users(user_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- TASKS TABLE
-- =========================================================
DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    assigned_to INT,
    description TEXT,
    deadline DATE,
    status ENUM('pending', 'in-progress', 'completed'),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
        ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- RESOURCES TABLE
-- =========================================================
DROP TABLE IF EXISTS resources;
CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    uploaded_by INT,
    file_link VARCHAR(255),
    description TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
        ON DELETE SET NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
