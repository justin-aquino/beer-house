require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const PORT = process.env.PORT || 8080
const axios = require("axios")
const db = require("./models") //this connects the sqlz db to express


// // Sets EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))
app.use(ejsLayouts);


// //controllers
app.use("/beers", require("./controllers/beers.js"))

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
  