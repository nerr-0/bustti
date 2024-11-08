
const db = require('./db');
// const bcrypt = require('bcrypt');
const bcrypt = require("bcrypt")
//my code 
//creating connection to database

    // password hashing 
    function createUser(username, password){
        const hashedPassword = bcrypt.hash(password,10)
        const [result] = con.query("INSERT INTO users (username, password) VALUES(?,?", [username,hashedPassword]);

        return result;
    }
// The code below is used to search for users in the quoted databases and tables by vaious parameters
function findByUsername(username){
    const [rows] = con.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0]
}
function findById(id){
    const[rows] = con.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0]
}
//The code below is used to validate user credentials at sign in, sign up and any other place deemed necessary
function validatePassword(enteredPassword, storedPassword){
    return bcrypt.compare(enteredPassword, storedPassword)
}
//  export {createUser, findByUsername, findById};
 module.exports = { createUser, findByUsername, findById, validatePassword }



