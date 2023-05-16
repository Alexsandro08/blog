const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {schema} = ('mongoose/models/user_model')



const Category = new Schema({
    name:{
        type:String,
        require:true
    },
    slug:{
        type:String,
        require:true
    }
})

mongoose.model('category', Category)