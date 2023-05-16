const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const passport = require('passport')
require('../models/user')
const User = mongoose.model('users')






module.exports = function (){

     passport.use(new localStrategy({usernameField: 'email'}, (email,password,done)=>{

        User.findOne({email:email}).then((users)=>{
            if(!users){
                return done(null, false, {message:'Account does not exist'})
            }

            bcrypt.compare(password, users.password, (erro,matches)=>{

                if(matches){
                    return done(null, users)
                } else{
                    return done(null, false, {message: 'invalid password'})
                }
            })
        })

     }))



     passport.serializeUser((users, done)=>{

        done(null, users.id)
     })

     passport.deserializeUser((id,done)=>{
        User.findById(id, (err, users)=>{
            done(err,users)
        })
     })

}