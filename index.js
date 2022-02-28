require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const PORT = process.env.PORT || 8080
const axios = require("axios")
const db = require("./models") //this connects the sqlz db to express


// // Sets EJS as the view engine
app.set('view engine', 'ejs');
// // Specifies the location of the static assets folder
// app.use(express.static('static'));
// // Sets up body-parser for parsing form data (req.body)
// app.use(express.urlencoded({ extended: false }));
// // Enables EJS Layouts middleware
app.use(ejsLayouts);
// //static css
// app.use(express.static("public"))

// // Adds some logging to each request
// app.use(require('morgan')('dev'));

// //controllers
// app.use("/results", require("./controllers/search.js"))

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs")
})


//async route lets you use async/await syntax in express route
app.get('/beers', async (req, res) => {
  const url = `https://api.punkapi.com/v2/beers`
    try {
      const response = await axios.get(url)
      const searchResults = response.data
    //   console.log(searchResults)
    //   res.json(searchResults[0])
    res.render("beers.ejs", {beers: searchResults})
    } catch (error) {
      console.log(error)
    }
    
})


app.listen(PORT, err => {
    console.log(`Hello from ${PORT}`) //WHAT IS THIS
  });
  