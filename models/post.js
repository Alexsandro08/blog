const mongoose = require('mongoose')
const {schema} = ('mongoose/models/user_model')
const Schema = mongoose.Schema




const Post = new Schema({

    title:{
        type:String
      
    },
    slug:{
        type:String
     
    },
    describe:{
        type:String
        
    },
    content:{
        type:String
      
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'category',
      
    },
    date:{
        type:Date,
        default:Date.now()
    }
    

})


mongoose.model('posts', Post)
