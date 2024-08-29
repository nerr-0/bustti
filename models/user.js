
const db = require('./db');
const bcrypt = require('bcryptjs');


//my code 
//creating connection to database

    // password hashing 
    function createUser(username, password){
        const hashedPassword = bcrypt.hash(password,10)
        const [result] = con.query("INSERT INTO users (username, password) VALUES(?,?", [username,hashedPassword]);

        return result;
    }
function findByUsername(username){
    const [rows] = con.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0]
}
function findById(id){
    const[rows] = con.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0]
}
function validatePassword(enteredPassword, storedPassword){
    return bcrypt.compare(enteredPassword, storedPassword)
}
//  export {createUser, findByUsername, findById};
 module.exports = { createUser, findByUsername, findById }



// class User{
//     function createUser(username, password){
//         const hashedPassword = bcrypt.hash(password,10)
//         const [result] = con.query("INSERT INTO users (username, password) VALUES(?,?", [username,hashedPassword]);

//         return result;
//     }
// function findByUsername(username){
//     const [rows] = con.query("SELECT * FROM users WHERE username = ?", [username]);
//     return rows[0]
// }
// function findById(id){
//     const[rows] = con.query("SELECT * FROM users WHERE id = ?", [id]);
//     return rows[0]
// }
// function validatePassword(enteredPassword, storedPassword){
//     return bcrypt.compare(enteredPassword, storedPassword)
// }
// }
// module.exports = User;