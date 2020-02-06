// Database
module.exports = {
   connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PWD || 'root',
      database: process.env.DB_NAME || 'database'
   }
};
