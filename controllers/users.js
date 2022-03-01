const { default: axios } = require('axios');
const express = require('express');
const db = require('../models');
const router = express.Router();



router.get("/", async (req,res) => {
  try {
    res.send("This is user page!")
  } catch(error) {
    console.log(error)
  }
})

router.get('/tracker', async (req, res) => {
    try {
        res.send("Hello")
    //   const favePokemons = await db.pokemon.findAll()
    //   res.render("favoritesList.ejs", {favePokemons: favePokemons})
    } catch (error) {
      console.log(error)
    }
  });
  

  module.exports = router;