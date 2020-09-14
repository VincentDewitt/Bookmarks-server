require('dotenv').config();

module.exports = {
    "migrationsDirectory": "migrations",
    "driver": "pg" ,
    "connectionString" : (process.env.NODE_ENV === 'test')
        ? process.env.DB_TESTURL
        : process.env.DB_URL,
}