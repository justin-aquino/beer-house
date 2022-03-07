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
        // console.log(req.query)
        let searchInput = req.query.searchInput
    if(searchInput) {
      beerData = beerData.filter(beer => {
          return beer.name.toLowerCase()  === searchInput.toLowerCase()
      })
    }

      res.render("main/beers.ejs", {beers: beerData, userId: req.cookies.userId})
      } catch (error) {
        console.log(error)
      }
      
  })


router.get("/beers/:id", async (req,res) => {
    const url = (`https://api.punkapi.com/v2/beers/${req.params.id}`)
    try {
        const response = await axios.get(url)
        const beerData = await response.data
        // console.log(beerData)
        res.render("main/show.ejs", {beer: beerData, userId: req.cookies.userId})
    
    } catch (error) {
        console.log(error)
    }
})

// router.delete("/users/tracker/:id", async (req,res) => {
//   await db.users_beer.destroy({
//     where: {
//       id: req.params.id
//     }
//   })

//   const getUser = await db.user.findOne({
//     where: {
//         id: res.locals.user.id
//     },
//     include: [db.beer]
// })
// // const userBeers = await getUser.getBeers()
//   res.render("users/users_beers.ejs", {beers: getUser.beers})
// })


//put request
// router.get("/users/tracker/edit/:id", async (req,res) => {
//   const getBeerToEdit = await db.users_beer.findOne({
//     where: {
//       beerId: req.params.id,
//       userId: res.locals.user.id
//     },
//     // include: [db.user]
//   })
//   const beerInfo = await db.beer.findOne({
//     where: {
//       id: getBeerToEdit.beerId
//     }
//   })
//   // console.log(getBeerToEdit)
//   res.render("main/editForm.ejs", {beer: beerInfo})
//   // res.send(beerInfo)
// })

// router.put("/users/tracker/:id", async (req,res) => {
//   await db.beer.update({
//     name: req.body.name,
//     yeast: req.body.yeast_type,
//     description: req.body.description
//   }, {
//     where: {
//       id: req.params.id
//     }
//   })
//   res.redirect("/users/tracker")
// })


// get beer review
// router.get("/users/tracker/:id", async (req,res) => {
//   await db.beer.findOne({
//     where: {
//       id: req.params.id
//     },
//     include: [db.review]
//   })
// })

// router.get("/users/tracker/:name/review", async (req,res) => {
//   //   res.render("users/users_beers.ejs")
//       // res.send("This is users_beers")
//   try {
//       const getBeer = await db.beer.findOne({
//           where: {
//              name: req.params.name
//           },
//           include: [db.review]
//       })
  
//       // const userBeers = await getUser.getBeers()
//           // console.log(userBeers)
  
//       res.render("main/reviewsForm.ejs", {beer: getBeer})
//   } catch (error) {
//       console.log(error)
//   }
// })
  



// router.post("/users/tracker/:name/review", async (req,res) => {
//   await db.beer.createReview({
//     review: req.body
//   })
//   res.redirect("/users/tracker/:id")
// })



module.exports = router