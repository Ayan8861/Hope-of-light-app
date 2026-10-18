-- Hope of Light database schema (MySQL 8+ / MariaDB 10.5+)
CREATE DATABASE IF NOT EXISTS hope_of_light CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hope_of_light;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  interest VARCHAR(100) NULL,
  role ENUM('member','admin') NOT NULL DEFAULT 'member',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(60) NOT NULL UNIQUE,
  title VARCHAR(150) NOT NULL,
  summary VARCHAR(300) NOT NULL,
  goal_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ref VARCHAR(24) NOT NULL UNIQUE,
  user_id INT NULL,
  project_id INT NULL,
  donor_name VARCHAR(100) NOT NULL,
  donor_email VARCHAR(190) NOT NULL,
  donor_phone VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  message VARCHAR(300) NULL,
  anonymous TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('pending','submitted','verified','rejected') NOT NULL DEFAULT 'pending',
  utr VARCHAR(20) NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL,
  verified_at TIMESTAMP NULL,
  INDEX idx_status (status),
  INDEX idx_project (project_id),
  INDEX idx_user (user_id),
  CONSTRAINT fk_don_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_don_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS volunteer_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_id INT NULL,
  message VARCHAR(500) NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vol_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_vol_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO projects (slug, title, summary, goal_amount, sort_order) VALUES
('education', 'Education for All', 'Quality education for children in remote areas through school construction, teacher training and scholarships.', 100000, 1),
('healthcare', 'Healthcare Access', 'Mobile medical clinics, health education and access to vital medicines in underserved communities.', 100000, 2),
('community', 'Community Development', 'Sustainable livelihoods through agriculture training, clean water initiatives and essential infrastructure.', 100000, 3),
('women-empowerment', 'Women Empowerment', 'Microfinance, skills training and leadership programs that help women earn and lead.', 100000, 4);
