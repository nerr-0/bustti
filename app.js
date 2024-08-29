 const express = require("express")
 const { createUser, findByUsername, findById } = require('./models/user');
 const  PORT = process.env.PORT || 3000;


 const app = express()

// import * as User from '..models/user'
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// setting the view engine for ejs
app.set("view engine", "ejs")



// Navigation bar Routes
app.get("/", (req,res)=>{
    res.render('home')
})
app.get("/admissions", (req,res)=>{
    res.render('admissions')
})
app.get("/academics",(req,res)=>{
    res.render("academics")
})
app.get("/departments",(req,res)=>{
    res.render("departments")
})
app.get("/services",(req,res)=>{
    res.render("services")
})
app.get("/sports",(req,res)=>{
    res.render("sports")
})
//Extra Routes
app.get("/register", (req,res)=>{
    //insert registration code here
})
app.post("/register",(req,res)=>{
    
    const { username, password } = req.body;

     
    if(!username || !password){
        return res.status(400).json({error: "Username and Password are required"})
    }
    else{
        
        const existingUser = findByUsername(username)
        if(existingUser){
            return res.status(400).json({message : "Username already taken"})
        }
        else{
            if(error){
                res.status(500).json({error: "Internal server error"})
            }
            else{
                createUser;
                res.status(201).json({message : "User registered successfully"})
            }
        }
    }
})
app.get("/login",(req,res)=>{
    //insert login code here
})


//INITIALIZING THE SERVER
app.listen(PORT, ()=>{
    console.log("SERVER IS LIVE")
})