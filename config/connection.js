const mysql = require('mysql');
let connection;
require('dotenv').config({path:__dirname+'/../.env'})

connection = mysql.createConnection({
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect();

module.exports = connection;