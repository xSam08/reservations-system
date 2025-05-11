const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  try {
    // Create a connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'admin123',
      database: 'reservations'
    });

    console.log('Successfully connected to the database!');

    // Test a simple query
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tables in the database:');
    rows.forEach(row => {
      console.log(`- ${row['Tables_in_reservations']}`);
    });

    // Test a query on the users table
    console.log('\nCreating a test user...');
    await connection.execute(`
      INSERT INTO users (user_id, email, password, name, role) 
      VALUES (UUID(), 'test@example.com', 'password123', 'Test User', 'CUSTOMER')
      ON DUPLICATE KEY UPDATE name = 'Test User Updated';
    `);

    const [users] = await connection.execute('SELECT * FROM users LIMIT 5');
    console.log('Users in the database:');
    users.forEach(user => {
      console.log(`- ${user.user_id}: ${user.name} (${user.email})`);
    });

    // Close the connection
    await connection.end();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testDatabaseConnection();