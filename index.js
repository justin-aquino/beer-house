require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const PORT = process.env.PORT || 8080
const axios = require("axios")
const db = require("./models") //this connects the sqlz db to express
const cookieParser = require("cookie-parser")
const cryptoJS = require("crypto-js")
const methodOverride = require("method-override")


// // Sets EJS as the view engine
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: false}))
app.use(ejsLayouts);
app.use("/public", express.static('public')); 



// CUSTOM LOGIN MIDDLEWARE //ALWAYS ON TOP OF CONTROLLERS MIDDLEWARE
app.use( async (req,res,next) => {
  if(req.cookies.userId){
      const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, process.env.SECRET)
      const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8)
      const user = await db.user.findByPk(decryptedIdString)
      res.locals.user = user 
  } else {
      res.locals.user = null
  }
  next()

})

// //controllers
app.use("/", require("./controllers/beers.js"))
app.use("/users", require("./controllers/users.js"))

app.get("/", (req,res) => {
  console.log("hello")
  res.render("main/index.ejs", {userId: req.cookies.userId})
})


app.listen(PORT, err => {
    console.log(`Hello from ${PORT}`) //WHAT IS THIS
  });
  