import { pool } from './db.js';
import { hashPassword } from './auth/utils/hashPassword.js';

export async function setupDatabase() {
  await createUserTable();
  await createSocialPlatformsTable();
  await createLeadersTable();
  await createLeaderSocialLinksTable();

  await seedSocialPlatforms();
  await createDefaultUser();
}

async function createUserTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tbl_users (
      id INT AUTO_INCREMENT,
      login VARCHAR(100) NOT NULL UNIQUE,
      hashedPassword VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      blocked BOOLEAN DEFAULT FALSE,
      
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      createdBy INT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      updatedBy INT NULL,
      deletedAt TIMESTAMP NULL,
      deletedBy INT NULL,
      
      CONSTRAINT PK_users PRIMARY KEY (id),
      CONSTRAINT FK_users_createdBy FOREIGN KEY (createdBy) REFERENCES tbl_users(id),
      CONSTRAINT FK_users_updatedBy FOREIGN KEY (updatedBy) REFERENCES tbl_users(id),
      CONSTRAINT FK_users_deletedBy FOREIGN KEY (deletedBy) REFERENCES tbl_users(id)
    );
  `);
}

async function createSocialPlatformsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tbl_social_platforms (
      id INT AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      CONSTRAINT PK_social_platforms PRIMARY KEY (id)
    );
  `);
}
async function createLeadersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tbl_leaders (
      id INT AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      role VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      createdBy INT NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      updatedBy INT NULL,
      deletedAt TIMESTAMP NULL,
      deletedBy INT NULL,
      
      CONSTRAINT PK_leaders PRIMARY KEY (id),
      CONSTRAINT FK_leaders_createdBy FOREIGN KEY (createdBy) REFERENCES tbl_users(id),
      CONSTRAINT FK_leaders_updatedBy FOREIGN KEY (updatedBy) REFERENCES tbl_users(id),
      CONSTRAINT FK_leaders_deletedBy FOREIGN KEY (deletedBy) REFERENCES tbl_users(id)
    );
  `);
}

async function createLeaderSocialLinksTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tbl_leader_social_links (
      id INT AUTO_INCREMENT,
      leaderId INT NOT NULL,
      platformId INT NOT NULL,
      url VARCHAR(255) NOT NULL,

      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      createdBy INT NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      updatedBy INT NULL,
      deletedAt TIMESTAMP NULL,
      deletedBy INT NULL,

      CONSTRAINT PK_leader_social_links PRIMARY KEY (id),
      CONSTRAINT FK_leader_social_links_leader FOREIGN KEY (leaderId) REFERENCES tbl_leaders(id) ON DELETE CASCADE,
      CONSTRAINT FK_leader_social_links_platform FOREIGN KEY (platformId) REFERENCES tbl_social_platforms(id) ON DELETE CASCADE,
      CONSTRAINT FK_leader_social_links_createdBy FOREIGN KEY (createdBy) REFERENCES tbl_users(id),
      CONSTRAINT FK_leader_social_links_updatedBy FOREIGN KEY (updatedBy) REFERENCES tbl_users(id),
      CONSTRAINT FK_leader_social_links_deletedBy FOREIGN KEY (deletedBy) REFERENCES tbl_users(id)
    );
  `);
}

async function seedSocialPlatforms() {
  const platforms = ['tiktok', 'youtube', 'liquipedia', 'soop', 'twitch', 'instagram', 'twitter', 'reddit', 'w3champions'];
  const values = platforms.map(() => '(?)').join(', ');
  const sql = `INSERT IGNORE INTO tbl_social_platforms (name) VALUES ${values};`;
  await pool.query(sql, platforms);
}

async function createDefaultUser() {
  const login = process.env.DEFAULT_USER_LOGIN;
  const email = process.env.DEFAULT_USER_EMAIL;
  const password = process.env.DEFAULT_USER_PASSWORD;

  if (!login || !email || !password) return;

  const hashed = await hashPassword(password);

  await pool.query(
    `
    INSERT IGNORE INTO tbl_users (login, email, hashedPassword)
    VALUES (?, ?, ?)
  `,
    [login, email, hashed]
  );

  console.log('Default admin user ensured.');
}
