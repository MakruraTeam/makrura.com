import { pool } from './db.js';

export async function setupDatabase() {
  await createUserTable();
  await createSocialPlatformsTable();
  await createLeadersTable();
  await createLeaderSocialLinksTable();

  await seedSocialPlatforms();
}

async function createUserTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT,
      login VARCHAR(100) NOT NULL UNIQUE,
      hashedPassword VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deletedAt TIMESTAMP NULL,
      CONSTRAINT PK_users PRIMARY KEY (id)
  );
  `);
}

async function createSocialPlatformsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS social_platforms (
      id INT AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT PK_social_platforms PRIMARY KEY (id)
    );
  `);
}

async function createLeadersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leaders (
      id INT AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      role VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deletedAt TIMESTAMP NULL,
      CONSTRAINT PK_leaders PRIMARY KEY (id)
  );
  `);
}

async function createLeaderSocialLinksTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leader_social_links (
      id INT AUTO_INCREMENT,
      leaderId INT NOT NULL,
      platformId INT NOT NULL,
      url VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT PK_leader_social_links PRIMARY KEY (id),
      CONSTRAINT UQ_leader_platform UNIQUE (leaderId, platformId),
      CONSTRAINT FK_leader FOREIGN KEY (leaderId) REFERENCES leaders(id) ON DELETE CASCADE,
      CONSTRAINT FK_platform FOREIGN KEY (platformId) REFERENCES social_platforms(id) ON DELETE CASCADE
    );
  `);
}

async function seedSocialPlatforms() {
  const platforms = ['tiktok', 'youtube', 'liquipedia', 'soop', 'twitch', 'instagram', 'twitter', 'reddit', 'w3champions'];
  const values = platforms.map(() => '(?)').join(', ');
  const sql = `INSERT IGNORE INTO social_platforms (name) VALUES ${values};`;
  await pool.query(sql, platforms);
}
