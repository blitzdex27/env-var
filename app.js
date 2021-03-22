//jshint esversion:6

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs")

const uri = "mongodb://localhost:27017/"
const dbName = "usersDB"
mongoose.connect(uri + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// secret long String
const secret = "alalalalalalalalaallalalalaalal"


// user schema


// upgrade user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

// plug the encrypt module to userSchema
userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"]
})

const User = mongoose.model("User", userSchema)



app.get("/", function(req, res) {
  res.render("home")
})
app.get("/register", function(req, res) {
  res.render("register")
})
app.get("/login", function(req, res) {
  res.render("login")
})


app.post("/register", function(req, res) {
  const username = req.body.username
  const password = req.body.password

  const newUser = new User({
    email: username,
    password: password
  })
  newUser.save(function(err) {
    if (!err) {
      res.render("secrets")
    } else {
      console.log(err)
    }
  })
})

app.post("/login", function(req, res) {

  User.find({
    email: req.body.username,
    password: req.body.password
  }, function(err, correctCredentials) {
    if (!err) {
      //
      if (!correctCredentials) {
        //
        console.log("Wrong username or password.")
        res.redirect("/login")
      } else {
        res.render("secrets")
      }
    } else {
      console.log(err)
    }
  })
})



let port = process.env.PORT
if (port == null || port == "") {
  port = 3000
}

app.listen(port, function() {
  console.log("Server started.")
})