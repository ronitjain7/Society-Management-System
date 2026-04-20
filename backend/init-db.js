const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    multipleStatements: true
  });

  console.log('Connected to MySQL server.');

  const dbName = process.env.DB_NAME || 'smart_apartment';
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  console.log(`Database ${dbName} ensured.`);

  await connection.query(`USE \`${dbName}\`;`);

  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('Schema.sql executed successfully.');
  } else {
    console.log('schema.sql not found, skipping table creation.');
  }

  await connection.end();
}

initDB().catch(err => {
  console.error('Error creating database:', err);
  process.exit(1);
});
