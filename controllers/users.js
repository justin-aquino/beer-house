const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
require('dotenv').config()

router.get('/new', (req, res)=>{
    res.render('users/new.ejs')
})

router.post('/', async (req, res)=>{
    const [newUser, created] = await db.user.findOrCreate({
        where: {email: req.body.email}
    })
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

router.get("/tracker", (req,res) => {
  res.render("users/tracker.ejs")
})

router.get('/logout', (req, res)=>{
    console.log('logging out')
    res.clearCookie('userId')
    res.redirect('/users/login')
})


module.exports = router

