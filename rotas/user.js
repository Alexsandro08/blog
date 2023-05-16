const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/user')
const User = mongoose.model('users')
const bcrypt = require('bcryptjs')
const Passport = require('passport')




router.get('/register', (req,res)=>{
    res.render('users/user')
})


router.post('/register',(req,res)=>{
    var erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        erros.push({texto:'Invalid name'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto:'Invalid email'})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        erros.push({texto:'Invalid password'})
    }

    if(req.body.password.length < 4){
        erros.push({texto:'Short password'})
    }

    if(req.body.password != req.body.password2){
        erros.push({texto:'Password does not match'})
    }

    if(erros.length > 0){
        res.render('users/user', {erros:erros})
    }
    else{
        User.findOne({email:req.body.email}).then((users)=>{
            if(users){
                req.flash('error', 'This account already exists')
                res.redirect('/register')
            } else{

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(newUser.password, salt, (erro, hash)=>{
                        if(erro){
                            req.flash('error', 'failed')
                            res.redirect('/')
                        }
                        
                        newUser.password = hash

                        newUser.save().then(()=>{
                            req.flash('success', 'Registration successfully registered!')
                            res.redirect('/')
                        }).catch(err =>{
                            req.flash('error', 'Failed to create user')
                            res.redirect('/register')
                        })
                    })
                })
            }
        }).catch(err =>{
            req.flash('error', 'failed')
            res.redirect('/register')
        })
    }
})


router.get('/login', (req,res)=>{
    res.render('users/login')
})

router.post('/login', (req,res,next)=>{

    Passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next)

})











module.exports = router