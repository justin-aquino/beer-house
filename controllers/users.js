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


// router.get("/tracker", async (req,res) => {
//     await user.findOne({
//         where: {
//             email: req.body.email
//         }
//     })

//     if (user) {
//         const getBeers = user.getBeer()
//     }
// })


//create user
router.post('/', async (req, res)=>{
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
})



router.get('/login', (req, res)=>{
    res.render('users/login.ejs', {error: null})
})


//login
router.post('/login', async (req, res)=>{
   const user = await db.user.findOne({where: {email: req.body.email}})
   if(!user) { // didn't find user in the database
       res.render('users/login.ejs', {error: 'Invalid email/password'})
   } else if(!bcrypt.compareSync(req.body.password, user.password)) { // found user but password was wrong 
       res.render('users/login.ejs', {error: 'Invalid email/password'})
   } else {
       const encryptedUserId = cryptojs.AES.encrypt(user.id.toString(), process.env.SECRET)
       const encryptedUserIdString = encryptedUserId.toString()  
       res.cookie('userId', encryptedUserIdString)
       res.redirect('/users/tracker')
   }
})

//tracker route

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

        res.render("users/users_beers.ejs", {beers: getUser.beers})
    } catch (error) {
        console.log(error)
    }
})

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


// finds users and their reviews
router.get("/tracker/:name", async (req,res) => {
    //   res.render("users/users_beers.ejs")
        // res.send("This is users_beers")
    try {
        const getBeer = await db.beer.findOne({
            where: {
               name: req.params.name
            }
        })
    
        // const userBeers = await getUser.getBeers()
            // console.log(userBeers)
    
        res.render("users/show.ejs", {beer: getBeer})
    } catch (error) {
        console.log(error)
    }
})
    





//logout route
router.get('/logout', (req, res)=>{
    console.log('logging out')
    res.clearCookie('userId')
    res.redirect('/users/login')
})


module.exports = router

