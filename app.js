const express = require("express")
const bodyParser = require("body-parser")
const authRouter = require("./routes/authRouter")
const profileRouter= require("./routes/profileRouter")
const cookieParser = require('cookie-parser');
const protect = require("./middleware/protect");
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/profile",protect,profileRouter)

//test
app.get('/',(req,res)=>{
    res.status(200).json({message:"Hello"})
})
module.exports = app