import { pool } from './db.js';
import { hashPassword } from './auth/utils/hashPassword.js';

export async function setupDatabase() {
  //GLOBAL
  await createImagesTable();
  await createSocialPlatformsTable();

  //WC3 DB
  await createWarcraft3RacesTable();

  //USERS
  await createUserTable();

  //DR UNIVERSITY
  await createFoundersTable();
  await createFounderWarcraft3RacesTable();
  await createFounderSocialLinksTable();

  await createMatchupTablesTable();
  await createMatchupCellsTable();
  await createMatchupCellLinksTable();

  await createDruPlayersTable();
  await createDruPlayersWC3RacesTable();
  await createDruPlayersSocialLinksTable();

  //NEWS
  await createArticleTypesTable();
  await createArticlesTable();
  await createArticleSocialLinksTable();

  //SEEDS
  await seedSocialPlatforms();
  await seedWarcraft3Races();
  await seedArticleTypes();
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

      CONSTRAINT PK_founder_social_links PRIMARY KEY (id),
      CONSTRAINT FK_founder_social_links_founder FOREIGN KEY (founderId) REFERENCES founders(id) ON DELETE CASCADE,
      CONSTRAINT FK_founder_social_links_platform FOREIGN KEY (platformId) REFERENCES social_platforms(id) ON DELETE CASCADE
    );
  `);
}

async function createArticleTypesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS article_types (
      id INT AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT PK_article_types PRIMARY KEY (id)
    );
  `);
}

async function createArticlesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id INT AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      shortDescription TEXT NOT NULL,
      content LONGTEXT NOT NULL,
      imageId INT NOT NULL,
      typeId INT NOT NULL,

      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT PK_articles PRIMARY KEY (id),
      CONSTRAINT FK_articles_image FOREIGN KEY (imageId) REFERENCES images(id) ON DELETE CASCADE,
      CONSTRAINT FK_articles_type FOREIGN KEY (typeId) REFERENCES article_types(id) ON DELETE CASCADE
    );
  `);
}

async function createArticleSocialLinksTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS article_social_links (
      id INT AUTO_INCREMENT,
      articleId INT NOT NULL,
      platformId INT NOT NULL,
      url VARCHAR(255) NOT NULL,
      text VARCHAR(255),

      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT PK_article_social_links PRIMARY KEY (id),
      CONSTRAINT FK_article_social_links_article FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE,
      CONSTRAINT FK_article_social_links_platform FOREIGN KEY (platformId) REFERENCES social_platforms(id) ON DELETE CASCADE
    );
  `);
}

async function createMatchupTablesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS matchup_tables (
      id INT AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT PK_matchup_tables PRIMARY KEY (id)
    );
  `);
}

async function createMatchupCellsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS matchup_cells (
      id INT AUTO_INCREMENT,
      tableId INT NOT NULL,
      rowRaceId INT NOT NULL,
      colRaceId INT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT PK_matchup_cells PRIMARY KEY (id),

      CONSTRAINT UQ_matchup_cells UNIQUE (tableId, rowRaceId, colRaceId),

      CONSTRAINT FK_matchup_cells_table 
        FOREIGN KEY (tableId) REFERENCES matchup_tables(id) ON DELETE CASCADE,

      CONSTRAINT FK_matchup_cells_row_race 
        FOREIGN KEY (rowRaceId) REFERENCES wc3_races(id) ON DELETE CASCADE,

      CONSTRAINT FK_matchup_cells_col_race 
        FOREIGN KEY (colRaceId) REFERENCES wc3_races(id) ON DELETE CASCADE
    );
  `);
}

async function createMatchupCellLinksTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS matchup_cell_links (
      id INT AUTO_INCREMENT,
      cellId INT NOT NULL,
      platformId INT NOT NULL,
      url VARCHAR(255) NOT NULL,
      text VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT PK_matchup_cell_links PRIMARY KEY (id),

      CONSTRAINT FK_matchup_cell_links_cell 
        FOREIGN KEY (cellId) REFERENCES matchup_cells(id) ON DELETE CASCADE,

      CONSTRAINT FK_matchup_cell_links_platform 
        FOREIGN KEY (platformId) REFERENCES social_platforms(id) ON DELETE CASCADE
    );
  `);
}

async function createDruPlayersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dru_players (
      id INT AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      mmr INT,
      country VARCHAR(120),
      role VARCHAR(255),
      contribution TEXT,

      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT PK_dru_players PRIMARY KEY (id)
    );
  `);
}

async function createDruPlayersWC3RacesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dru_players_wc3_races (
      id INT AUTO_INCREMENT,
      playerId INT NOT NULL,
      raceId INT NOT NULL,

      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT PK_dru_players_wc3_races PRIMARY KEY (id),

      CONSTRAINT FK_dru_players_wc3_races_player
        FOREIGN KEY (playerId) REFERENCES dru_players(id)
        ON DELETE CASCADE,

      CONSTRAINT FK_dru_players_wc3_races_race
        FOREIGN KEY (raceId) REFERENCES wc3_races(id)
        ON DELETE CASCADE
    );
  `);
}

async function createDruPlayersSocialLinksTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dru_players_social_links (
      id INT AUTO_INCREMENT,
      playerId INT NOT NULL,
      platformId INT NOT NULL,
      url VARCHAR(255) NOT NULL,

      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT PK_dru_players_social_links PRIMARY KEY (id),

      CONSTRAINT FK_dru_players_social_links_player
        FOREIGN KEY (playerId) REFERENCES dru_players(id)
        ON DELETE CASCADE,

      CONSTRAINT FK_dru_players_social_links_platform
        FOREIGN KEY (platformId) REFERENCES social_platforms(id)
        ON DELETE CASCADE
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

async function seedArticleTypes() {
  const types = ['DR University', 'Other'];
  const values = types.map(() => '(?)').join(', ');
  const sql = `INSERT IGNORE INTO article_types (name) VALUES ${values};`;
  await pool.query(sql, types);
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
