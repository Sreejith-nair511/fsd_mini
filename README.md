DBMS_PROJECT

Personal Productivity Management System (PPMS)

A database-driven mini-project for managing users, notes, progress tracking, and timers. The schema is fully normalized (3NF) with audit logging, stored procedures, views, triggers, and security.

📌 Features

User Management: Register/login with roles (user/admin).

Notes: Create, edit, archive, delete with full audit history.

Progress Tracker: Track tasks with status, percentage completion, and due dates.

Timers: Focus timers (Pomodoro-style) with logs.

Audit Logging: Triggers track updates and deletions on notes.

Views: Summary dashboards (v_user_note_counts, v_progress_summary).

Stored Routines: Functions & procedures for reusable logic.

Transactions: Ensures atomic updates.

Security: App user with least-privilege access.

📂 Database Structure
1. Create Database
DROP DATABASE IF EXISTS ppms_db;
CREATE DATABASE ppms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE ppms_db;

2. Core Tables

users → Stores user info

notes → Notes linked to users

progress → Task tracker

timers → Timer sessions

note_audit → Audit history

3. Views

v_user_note_counts → Notes per user

v_progress_summary → Task completion overview

4. Stored Function
fn_progress_bucket(pct INT) → Returns 'High', 'Medium', 'Low'

5. Stored Procedures

sp_create_user

sp_add_note

sp_update_progress

6. Triggers

trg_notes_before_update

trg_notes_before_delete

7. Transaction Example

Ensures atomic note creation + progress update.

🗂 SQL Script

The full SQL script is inside this project.
It includes:

Schema (tables, FKs, constraints)

Seed data (sample users, notes, tasks, timers)

Views, functions, procedures, triggers

Test queries

Security setup (ppms_app user with least privilege)

⚙️ How to Run

Open MySQL Workbench or CLI.

Copy the provided script into a SQL editor.

Run the script to create database, tables, views, and insert data.

Explore with:

SELECT * FROM v_progress_summary;
SELECT * FROM v_user_note_counts;

📊 ER Diagram and script 
-- PPMS (Personal Productivity Management System) - Full MySQL Script
-- Generated: 20250822_044643

-- 1) Create Database
DROP DATABASE IF EXISTS ppms_db;
CREATE DATABASE ppms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE ppms_db;

-- 2) Tables
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE notes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NULL,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notes_userid_created (user_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  task_name VARCHAR(200) NOT NULL,
  status ENUM('todo','in_progress','blocked','completed') NOT NULL DEFAULT 'todo',
  percentage TINYINT NOT NULL DEFAULT 0 CHECK (percentage BETWEEN 0 AND 100),
  due_date DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_progress_user_status (user_id, status)
) ENGINE=InnoDB;

CREATE TABLE timers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  label VARCHAR(100) NULL,
  duration_seconds INT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  started_at DATETIME NULL,
  ended_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_timers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_timers_user_completed (user_id, completed)
) ENGINE=InnoDB;

CREATE TABLE note_audit (
  audit_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  note_id BIGINT NULL,
  user_id BIGINT NULL,
  action ENUM('INSERT','UPDATE','DELETE') NOT NULL,
  old_title VARCHAR(200) NULL,
  old_content TEXT NULL,
  new_title VARCHAR(200) NULL,
  new_content TEXT NULL,
  action_ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3) Seed Data
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Alice Kumar','alice@example.com','$2y$10$fakehashalice','user'),
('Bob Singh','bob@example.com','$2y$10$fakehashbob','user'),
('Admin User','admin@example.com','$2y$10$fakehashadmin','admin');

INSERT INTO notes (user_id, title, content) VALUES
(1,'Grocery List','Milk, Eggs, Bread'),
(1,'DBMS Report','Finish ER + SQL'),
(2,'React Setup','Initialize Next.js + Tailwind');

INSERT INTO progress (user_id, task_name, status, percentage, due_date) VALUES
(1,'Finish DBMS Report','in_progress',60, DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
(2,'React Project Setup','completed',100, CURDATE()),
(2,'Write Unit Tests','todo',0, DATE_ADD(CURDATE(), INTERVAL 7 DAY));

INSERT INTO timers (user_id, label, duration_seconds, completed, started_at, ended_at) VALUES
(1,'Pomodoro',1500, TRUE, NOW() - INTERVAL 30 MINUTE, NOW() - INTERVAL 5 MINUTE),
(2,'Quick Focus',900, FALSE, NOW() - INTERVAL 10 MINUTE, NULL);

-- 4) Views
CREATE OR REPLACE VIEW v_user_note_counts AS
SELECT u.id AS user_id, u.full_name, COUNT(n.id) AS total_notes
FROM users u LEFT JOIN notes n ON n.user_id = u.id
GROUP BY u.id, u.full_name;

CREATE OR REPLACE VIEW v_progress_summary AS
SELECT 
  u.id AS user_id,
  u.full_name,
  SUM(CASE WHEN p.status='completed' THEN 1 ELSE 0 END) AS completed_tasks,
  SUM(CASE WHEN p.status IN ('todo','in_progress','blocked') THEN 1 ELSE 0 END) AS open_tasks,
  ROUND(AVG(p.percentage), 2) AS avg_completion_pct
FROM users u
LEFT JOIN progress p ON p.user_id = u.id
GROUP BY u.id, u.full_name;

-- 5) Stored Function
DELIMITER //
CREATE OR REPLACE FUNCTION fn_progress_bucket(pct INT)
RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
  IF pct >= 80 THEN RETURN 'High';
  ELSEIF pct >= 40 THEN RETURN 'Medium';
  ELSE RETURN 'Low';
  END IF;
END//
DELIMITER ;

-- 6) Stored Procedures
DELIMITER //
CREATE OR REPLACE PROCEDURE sp_create_user(
  IN p_full_name VARCHAR(100),
  IN p_email VARCHAR(191),
  IN p_password_hash VARCHAR(255),
  OUT p_user_id BIGINT
)
BEGIN
  INSERT INTO users(full_name, email, password_hash) VALUES (p_full_name, p_email, p_password_hash);
  SET p_user_id = LAST_INSERT_ID();
END//
DELIMITER ;

DELIMITER //
CREATE OR REPLACE PROCEDURE sp_add_note(
  IN p_user_id BIGINT,
  IN p_title VARCHAR(200),
  IN p_content TEXT,
  OUT p_note_id BIGINT
)
BEGIN
  INSERT INTO notes(user_id, title, content) VALUES (p_user_id, p_title, p_content);
  SET p_note_id = LAST_INSERT_ID();
END//
DELIMITER ;

DELIMITER //
CREATE OR REPLACE PROCEDURE sp_update_progress(
  IN p_id BIGINT,
  IN p_status ENUM('todo','in_progress','blocked','completed'),
  IN p_percentage TINYINT
)
BEGIN
  UPDATE progress
    SET status = p_status,
        percentage = p_percentage
  WHERE id = p_id;
END//
DELIMITER ;

-- 7) Triggers (audit on notes)
DELIMITER //
CREATE TRIGGER trg_notes_before_update
BEFORE UPDATE ON notes
FOR EACH ROW
BEGIN
  INSERT INTO note_audit(note_id, user_id, action, old_title, old_content, new_title, new_content)
  VALUES(OLD.id, OLD.user_id, 'UPDATE', OLD.title, OLD.content, NEW.title, NEW.content);
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_notes_before_delete
BEFORE DELETE ON notes
FOR EACH ROW
BEGIN
  INSERT INTO note_audit(note_id, user_id, action, old_title, old_content, new_title, new_content)
  VALUES(OLD.id, OLD.user_id, 'DELETE', OLD.title, OLD.content, NULL, NULL);
END//
DELIMITER ;

-- 8) Sample Queries (for testing)
-- a) All notes for a user
SELECT u.full_name, n.title, n.created_at
FROM users u JOIN notes n ON n.user_id = u.id
WHERE u.email = 'alice@example.com'
ORDER BY n.created_at DESC;

-- b) Progress overview with bucket
SELECT p.user_id, p.task_name, p.percentage, fn_progress_bucket(p.percentage) AS bucket
FROM progress p;

-- c) Timers completed
SELECT u.full_name, t.label, t.duration_seconds
FROM timers t JOIN users u ON u.id = t.user_id
WHERE t.completed = TRUE;

-- d) Aggregate view usage
SELECT * FROM v_user_note_counts;
SELECT * FROM v_progress_summary;

-- e) Transaction example
START TRANSACTION;
INSERT INTO notes(user_id, title, content) VALUES (1, 'Transactional Note', 'Created within a transaction');
UPDATE progress SET percentage = LEAST(percentage + 10, 100) WHERE user_id = 1 AND status <> 'completed';
COMMIT;

-- 9) App User (Least privilege demo)
CREATE USER IF NOT EXISTS 'ppms_app'@'localhost' IDENTIFIED BY 'AppUser#2025';
GRANT SELECT, INSERT, UPDATE, DELETE ON ppms_db.* TO 'ppms_app'@'localhost';
FLUSH PRIVILEGES;

-- 10) Backup note:
-- mysqldump -u root -p ppms_db > ppms_db_backup.sql

er diagram 
<img width="931" height="840" alt="ppms_er_20250822_044643 png" src="https://github.com/user-attachments/assets/19eb788a-8742-4f61-a2db-c783cb6868da" />




🔮 Future Enhancements

Tagging for notes (many-to-many).

Soft deletes with deleted_at.

Row-level security.

Event-driven archiving & partitioning.

Full-text search in notes.
