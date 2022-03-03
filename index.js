require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const PORT = process.env.PORT || 8080
const axios = require("axios")
const db = require("./models") //this connects the sqlz db to express
const cookieParser = require("cookie-parser")
const cryptoJS = require("crypto-js")


// // Sets EJS as the view engine
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))
app.use(ejsLayouts);


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
app.use("/beers", require("./controllers/beers.js"))
app.use("/users", require("./controllers/users.js"))
// app.use("/users/reviews", require("./controllers/reviews.js"))

// Routes
// app.get("/", (req, res) => {
//   res.render("index.ejs")
// })


// //async route lets you use async/await syntax in express route
// app.get('/beers', async (req, res) => {
//   const url = `https://api.punkapi.com/v2/beers?page=2&per_page=80`
//     try {
//       const response = await axios.get(url)
//       const beerData = response.data
//     res.render("beers.ejs", {beers: beerData})
//     } catch (error) {
//       console.log(error)
//     }
    
// })


app.listen(PORT, err => {
    console.log(`Hello from ${PORT}`) //WHAT IS THIS
  });
  