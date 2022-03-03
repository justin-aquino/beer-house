const express = require("express")
const router = express.Router()
const axios = require("axios")
const db = require("../models")
require("dotenv").config()



router.get('/beers', async (req, res) => {
    const url = `https://api.punkapi.com/v2/beers?page=2&per_page=80`
      try {
        const response = await axios.get(url)
        let beerData = response.data
        console.log(req.query)
        let searchInput = req.query.searchInput
    if(searchInput) {
      beerData = beerData.filter(beer => {
          return beer.name.toLowerCase()  === searchInput.toLowerCase()
      })
    }

      res.render("main/beers.ejs", {beers: beerData})
      } catch (error) {
        console.log(error)
      }
      
  })


router.get("/beers/:id", async (req,res) => {
    const url = (`https://api.punkapi.com/v2/beers/${req.params.id}`)
    try {
        const response = await axios.get(url)
        const beerData = await response.data
        console.log(beerData)
        res.render("main/show.ejs", {beer: beerData})
    
    } catch (error) {
        console.log(error)
    }
})

router.delete("/users/tracker/:id", async (req,res) => {
  await db.users_beer.destroy({
    where: {
      id: req.params.id
    }
  })
  res.render("users/users_beers.ejs")
})



//get user review for beer

// router.get("/user")



module.exports = router