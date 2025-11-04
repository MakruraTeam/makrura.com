import { pool } from './db.js';
import { hashPassword } from './auth/utils/hashPassword.js';

export async function setupDatabase() {
  await createImagesTable();

  await createUserTable();
  await createSocialPlatformsTable();
  await createFoundersTable();
  await createWarcraft3RacesTable();
  await createFounderWarcraft3RacesTable();
  await createFounderSocialLinksTable();

  await seedWarcraft3Races();
  await seedSocialPlatforms();
  await createDefaultUser();
}

async function createImagesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS images (
      id INT AUTO_INCREMENT,
      filename VARCHAR(255),
      content_type VARCHAR(100),
      data LONGBLOB NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
  `);
}

async function createUserTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT,
      login VARCHAR(100) NOT NULL UNIQUE,
      hashedPassword VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      blocked BOOLEAN DEFAULT FALSE,
      
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

async function createFoundersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS founders (
      id INT AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      role VARCHAR(255) NOT NULL,
      contribution TEXT NOT NULL,
      imageId INT,

      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deletedAt TIMESTAMP NULL,

      PRIMARY KEY (id),
      CONSTRAINT FK_founders_image FOREIGN KEY (imageId) REFERENCES images(id) ON DELETE SET NULL
    );
  `);
}

async function createWarcraft3RacesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wc3_races (
      id INT AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT PK_wc3_races PRIMARY KEY (id)
    );
  `);
}

async function createFounderWarcraft3RacesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS founder_wc3_races (
      id INT AUTO_INCREMENT,
      founderId INT NOT NULL,
      raceId INT NOT NULL,

      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deletedAt TIMESTAMP NULL,

      CONSTRAINT PK_founder_wc3_races PRIMARY KEY (id),
      CONSTRAINT FK_founder_wc3_races_founder FOREIGN KEY (founderId) REFERENCES founders(id) ON DELETE CASCADE,
      CONSTRAINT FK_founder_wc3_races_race FOREIGN KEY (raceId) REFERENCES wc3_races(id) ON DELETE CASCADE
    );
  `);
}

async function createFounderSocialLinksTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS founder_social_links (
      id INT AUTO_INCREMENT,
      founderId INT NOT NULL,
      platformId INT NOT NULL,
      url VARCHAR(255) NOT NULL,

      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deletedAt TIMESTAMP NULL,

      CONSTRAINT PK_founder_social_links PRIMARY KEY (id),
      CONSTRAINT FK_founder_social_links_founder FOREIGN KEY (founderId) REFERENCES founders(id) ON DELETE CASCADE,
      CONSTRAINT FK_founder_social_links_platform FOREIGN KEY (platformId) REFERENCES social_platforms(id) ON DELETE CASCADE
    );
  `);
}

async function seedSocialPlatforms() {
  const platforms = ['tiktok', 'youtube', 'liquipedia', 'soop', 'twitch', 'instagram', 'twitter', 'reddit', 'w3champions'];
  const values = platforms.map(() => '(?)').join(', ');
  const sql = `INSERT IGNORE INTO social_platforms (name) VALUES ${values};`;
  await pool.query(sql, platforms);
}

async function seedWarcraft3Races() {
  const races = ['Human', 'Orc', 'Undead', 'Night Elf', 'Neutral'];
  const values = races.map(() => '(?)').join(', ');
  const sql = `INSERT IGNORE INTO wc3_races (name) VALUES ${values};`;
  await pool.query(sql, races);
}

async function createDefaultUser() {
  const login = process.env.DEFAULT_USER_LOGIN;
  const email = process.env.DEFAULT_USER_EMAIL;
  const password = process.env.DEFAULT_USER_PASSWORD;

  if (!login || !email || !password) return;

  const hashed = await hashPassword(password);

  await pool.query(
    `
    INSERT IGNORE INTO users (login, email, hashedPassword)
    VALUES (?, ?, ?)
  `,
    [login, email, hashed]
  );

  console.log('Default admin user created.');
}
