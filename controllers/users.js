const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
const { user } = require('pg/lib/defaults')
const { append } = require('express/lib/response')
require('dotenv').config()

router.get('/new', (req, res)=>{
    res.render('users/new.ejs')
})


//create user
router.post('/', async (req, res)=>{

  try {
    const [newUser, created] = await db.user.findOrCreate({
        where: {
          email: req.body.email
        }
    })

    // const getBeers = await user.getBeer()
    if(!created){
        console.log('User already exists')
        // render the login page and send an appropriate message
    } else {
    
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        newUser.password = hashedPassword
        await newUser.save()
        const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET)
        const encryptedUserIdString = encryptedUserId.toString()
        // console.log(encryptedUserIdString)
        res.cookie('userId', encryptedUserIdString)
        res.redirect('/users/login')
    }
  } catch (error) {
    console.log(error)
  }
})



router.get('/login', (req, res)=>{
    res.render('users/login.ejs', {error: "w"})
})


//login
router.post('/login', async (req, res)=>{
  try {
    const user = await db.user.findOne({where: {email: req.body.email}})
    if(!user) { // didn't find user in the database
        res.render('users/login.ejs', {error: 'Invalid email/password', userId: req.cookies.userId })
    } else if(!bcrypt.compareSync(req.body.password, user.password)) { // found user but password was wrong 
        res.render('users/login.ejs', {error: 'Invalid email/password', userId: req.cookies.userId})
    } else {
        const encryptedUserId = cryptojs.AES.encrypt(user.id.toString(), process.env.SECRET)
        const encryptedUserIdString = encryptedUserId.toString()  
        res.cookie('userId', encryptedUserIdString)
        res.redirect('/users/tracker')
    }
  } catch (error) {
    console.log(error)
  }
})

//tracker route


//add beer to the users_beers db

router.post("/tracker", async (req,res) => {
    try {
        const [beer, beerCreated] = await db.beer.findOrCreate({
            where: {
                name: req.body.name,
                yeast_type: req.body.yeast_type,
                description: req.body.description,
            }
        })
        res.locals.user.addBeer(beer)
        res.redirect("/users/tracker")
        // console.log()
        // res.send("This is users_beers")
    } catch (error) {
        console.log(error)
    }
})


//finds the user, and the beers in their users_beers table
router.get("/tracker", async (req,res) => {
//   res.render("users/users_beers.ejs")
    // res.send("This is users_beers")
    try {
        const getUser = await db.user.findOne({
            where: {
                id: res.locals.user.id
            },
            include: [db.beer]
        })

        const userBeers = await getUser.getBeers()
        // console.log(userBeers)

        res.render("users/users_beers.ejs", {beers: getUser.beers, userId: req.cookies.userId})
    } catch (error) {
        console.log(error)
    }
})


//delete

router.delete("/tracker/:name", async (req,res) => {
  try {
    await db.beer.destroy({
      where: {
        name: req.params.name
      }
    })
  } catch (error) {
    console.log(error)
  }
    res.redirect(`/users/tracker`)
})
  
//show for user_beers

router.get("/tracker/:name", async (req,res) => {
    try {
        const findUser = await db.user.findOne({
          where: {
            id: res.locals.user.id
          }
        })

        const getBeer = await db.beer.findOne({
            where: {
                name: req.params.name
            },
            include: [db.review]
        })
        res.render("users/show.ejs", {beer: getBeer, usersLocalId: res.locals.user.id, user: findUser, userId: req.cookies.userId})
    } catch (error) {
        console.log(error)
    }
})

// finds users and their reviews

//this displays the show beer with the newly added review post
//DONT TAKE OFF THE /REVIEWS IN THE ROUTE
router.get("/tracker/:name/review", async (req,res) => { //if something goes wrong, you removed the /review in the route
    //   res.render("users/users_beers.ejs")
        // res.send("This is users_beers")
    try {
        const getBeer = await db.beer.findOne({
            where: {
               name: req.params.name
            },
        })
    
        // const userBeers = await getUser.getBeers()
            // console.log(userBeers)
        const foundUser = await db.user.findOne({
          where: {
            id: res.locals.user.id
          }
        })
        console.log(foundUser)
        res.render("main/reviewsForm.ejs", {beer: getBeer, user: foundUser, userId: req.cookies.userId})
    } catch (error) {
        console.log(error)
    }
  })

  //PUT REQUEST for Beers
  router.get("/tracker/edit/:id", async (req,res) => {
    try {
      const getBeerToEdit = await db.users_beer.findOne({
        where: {
          beerId: req.params.id,
          userId: res.locals.user.id
        },
        // include: [db.user]
      })
      const beerInfo = await db.beer.findOne({
        where: {
          id: getBeerToEdit.beerId
        }
      })
      console.log(getBeerToEdit)
      res.render("main/editForm.ejs", {beer: beerInfo, userId: req.cookies.userId})
    } catch (error) {
      console.log(error)
    }
    // res.send(beerInfo)
  })
  
  router.put("/tracker/:id", async (req,res) => {
    try {
      await db.beer.update({
        name: req.body.name,
        yeast: req.body.yeast_type,
        description: req.body.description
      }, {
        where: {
          id: req.params.id
        }
      })
    } catch (error) {
      console.log(error)
    }
    res.redirect("/users/tracker")
  })
  

  //REVIEWS CRUD
  
  //post route for the reviews.
  router.post("/tracker/:name/review", async (req,res) => {
    try {
      const makeReview = await db.review.create({
          review: req.body.review
        })
      
        const getBeer = await db.beer.findOne({
          where: {
              name: req.params.name
          }
        })
        
        const getUser = await db.user.findOne({
            where: {
                id: res.locals.user.id
            }
        })
  
        await getUser.addReview(makeReview)
        await getBeer.addReview(makeReview)
    } catch (error) {
      console.log(error)
    }
    //   const getReviews = await db.review.findAll()
      
    res.redirect(`/users/tracker/${req.params.name}`)
  })
  
//delete route for the reviews


router.delete("/tracker/reviews/:id", async (req,res) => {
  try {
    const findReview = await db.review.findOne({
      where: {
        id: req.params.id
      }
    })
    // console.log(findReview)
      await findReview.destroy()
  } catch (error) {
    console.log(error)
  }
  // const userBeers = await getUser.getBeers()
  //   res.render("users/users_beers.ejs", {beers: getUser.beers})
  res.redirect(`/users/tracker`)
})


//edit route

router.get("/tracker/reviews/edit/:id", async (req,res) => {
  try {
    const getReviewToEdit = await db.review.findOne({
      where: {
        id: req.params.id,
        // userId: res.locals.user.id
      },
      // include: [db.user]
    })
    // const beerInfo = await db.beer.findOne({
    //   where: {
    //     id: getBeerToEdit.beerId
    //   }
    // })
    console.log(getReviewToEdit)
    res.render("users/reviewEditForm.ejs", {review: getReviewToEdit, userId: req.cookies.userId})

  } catch (error) {
    console.log(error)
  }
  // res.send(beerInfo)
})

router.put("/tracker/reviews/:id", async (req,res) => {
  try {
    await db.review.update({
      userName: req.body.userName,
      review: req.body.review
    }, {
      where: {
        id: req.params.id
      }
    })
  } catch(error) {
    console.log(error)
  }
  res.redirect("/users/tracker")
})


//logout route
router.get('/logout', (req, res)=>{
    console.log('logging out')
    res.clearCookie('userId')
    res.redirect('/users/login')
})


module.exports = router

