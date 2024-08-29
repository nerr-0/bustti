const mysql = require('mysql')


const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  con.connect((error) => {
    if (error) {
      console.error(error);
    } else {
      console.log("CONNECTED TO  DATABASE");
    }
})
module.exports = con;