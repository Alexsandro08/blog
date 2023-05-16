//dependencias
const express = require('express')
const hand = require('express-handlebars')
const app = express()
const index = require('./rotas/index')
const user = require('./rotas/user')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const passport = require('passport')
require('./models/post')
const Posts = mongoose.model('posts')
require('./models/category')
const Category = mongoose.model('category')
const Passport = require('passport')
require('./config/att')(passport)
const db = require('./config/db')
const dotEnv = require('dotenv')
dotEnv.config()


//configs
//session
app.use(session({
    secret:"Testando",
    resave:true,
    saveUninitialized:true
}))

    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

//middleware
app.use((req,res, next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error') 
    res.locals.user = req.user || null
    next()
})

//express dados
app.use(express.urlencoded({extended:true}))
app.use(express.json())



//Handlebars
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', hand.engine({defaultLayout: 'main'})),
 

app.set('view engine', 'handlebars')

//Arquivos estaticos
app.use(express.static(path.join(__dirname, 'public')))

//mongoose
mongoose.connect(db.dotEnv,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
     console.log('Conectado ao mongo')
    }
).catch(err =>{
    console.log(err)
})


// todas rotas
app.use('/', index)
app.use('/', user)

//Rotas principal
app.get('/', (req,res)=>{
    Posts.find().populate('category').sort({data:'desc'}).lean().then((posts)=>{
         res.render('index', {posts:posts})
    }).catch(err =>{
        req.flash('error', 'Failed posts')
        res.redirect('/404')
    })
})

//Rota de Post
 app.get('/posts/:slug', (req,res)=>{
    Posts.findOne({slug: req.params.slug}).lean().then((posts)=>{
        if(posts){
            res.render('posts/index',{posts:posts})
        } else{
            req.flash('error', 'Post does not exist')
            res.redirect('/')
        }
    }).catch(err =>{
        req.flash('error', 'internial erro')
        res.redirect('/')
    })
 })


//Rota de listagem de categoria
app.get('/categories', (req,res)=>{
    Category.find().lean().then((category)=>{
        res.render('category/index', {category:category})
    }).catch(err =>{
        req.flash('error','internial erro')
        res.redirect('/')
    })

})

app.get('/categories/:slug', (req,res)=>{
    Category.findOne({slug: req.params.slug}).then((category)=>{
            if(category){
                Posts.find({category:category._id}).lean().then((posts)=>{
                    res.render('category/posts', {posts:posts, category:category})
                }).catch(err =>{
                    req.flash('error', 'failed')
                    res.redirect('/')
                })

            } else {
                req.flash('error', 'failed')
                res.redirect('/')
            }
    }).catch(err =>{
        req.flash('error', 'failed')
        res.redirect('/')
    })
})

//rota de erro
app.get('/404', (req,res)=>{
    res.send('error 404')
})


//Porta
const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log("Porta criada")
})