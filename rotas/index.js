const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/category')
const Category = mongoose.model('category')
require('../models/post')
const Post = mongoose.model('posts')
const {user} = require('../helps/user')




router.get('/category', (req,res)=>{
    Category.find().lean().then((category)=>{
        res.render('category', {category: category})
    }).catch(err =>{
        req.flash('error')
    })
    
})

router.get('/category/add', (req,res)=>{
    res.render('add')
})

router.post('/category/new', (req,res)=>{

    let erros = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        erros.push({texto:'Invalid name '})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:'Invalid slug '})
    }

    if(req.body.name.length < 2){
        erros.push({texto:'Short name'})
    }
    if(req.body.slug.length < 2){
        erros.push({texto:'Slug name'})
    }

    if(erros.length > 0){
        res.render('add', {erros:erros})
    }
    else{
        const newCategory = {
    
            name: req.body.name,
            slug: req.body.slug
        }

        new Category(newCategory).save().then(()=>{
            req.flash('success', 'Category added successfully')
            res.redirect('/category')
    }).catch(err =>{
        req.flash('error', 'failed to save :(')
        res.redirect('/')
    })
}

})

router.get('/category/edit/:id', user, (req,res)=>{
    Category.findOne({where:{_id:req.params.id}}).lean().then((category)=>{
        res.render('edit', {category:category})
    }).catch(err =>{
        req.flash('error', 'failed category does not exist')
        res.redirect('/category')
    })  
})


router.post("/category/edit", user, (req, res) => {
    Category.findOne({_id: req.body.id}).then((category) => {
        let erros = []

        if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
            erros.push({ texto: "Invalid name " })
        }
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({ texto: "Invalid slug" })
        }
        if (req.body.name.length < 2) {
            erros.push({ texto: "Too small slug" })
        }
        if (erros.length > 0) {
            Category.findOne({_id: req.body.id }).then((category) => {
                res.render("edit", { category: category})
            }).catch(err => {
                req.flash("error", "Edit failed")
                res.redirect("/category")
            })
            
        } else {

            category.name = req.body.name
            category.slug = req.body.slug

            category.save().then(() => {
                req.flash("success", "Category edited successfully!")
                res.redirect("/category")
            }).catch((err) => {
                req.flash("error", "Failed edited category")
                res.redirect("/category")
            })

        }
    }).catch((err) => {
        req.flash("error", "Error registering category")
        res.redirect("/category")
    })
})

router.post('/category/del',user, (req,res)=>{
    Category.remove({_id:req.body.id}).then(()=>{
        req.flash('success', 'category deleted successfully!')
        res.redirect('/category')
    }).catch(err =>{
        req.flash('error', 'error deleting category')
        res.redirect('/category')
    })
})

router.get('/posts', (req,res)=>{
    Post.find().populate('category').sort({data:'desc'}).lean().then((posts)=>{
        res.render('posts', {posts:posts})
    }).catch(err =>{
        req.flash('error', 'Failed list')
        res.redirect('/posts')
    })
 
})

router.get('/posts/add', (req,res)=>{
    Category.find().lean().then((category)=>{
          res.render('addPost', {category:category})
    }).catch(err =>{
        req.flash('error', 'Failed')
        res.redirect('/category')
    })
  
})

router.post('/posts/new',(req,res)=>{
    let erros = []

    if(!req.body.title || typeof req.body.title == undefined || req.body.title == null){
        erros.push({texto:'Invalid name '})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:'Invalid slug '})
    }
    if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
        erros.push({texto:'Invalid content'})
    }

    if(req.body.title.length < 2){
        erros.push({texto:'Short name'})
    }
    if(req.body.slug.length < 2){
        erros.push({texto:'Slug name'})
    }

    if(erros.length > 0){
        res.render('addPost', {erros:erros})
    }

    else{
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            describe: req.body.describe,
            content: req.body.content,
            category: req.body.category,
           
        }
        
        new Post (newPost).save().then(() => {
            req.flash('success', 'Post created successfully!')
            res.redirect('/posts')
        }).catch((err) => {
            req.flash('error', 'Failed to create post :( ')
            res.redirect('/posts')
        })
}})

router.get('/posts/edit/:id', user, (req,res)=>{
    Post.findOne({where:{_id:req.params.id}}).lean().then((posts)=>{
           
            Category.findOne().then((category)=>{
                res.render('editPost', {category:category, posts:posts })
            }).catch(err =>{
                req.flash('error', 'error load category')
                res.redirect('/posts/edit')
            })

    }).catch(err =>{
        req.flash('error', 'failed load posts')
        res.redirect('/posts')
    })
})

router.post('/posts/edit', user, (req,res)=>{
    Post.findOne({where:{_id: req.body.id}}).then((posts)=>{
        let erros = []

        if(!req.body.title || typeof req.body.title == undefined || req.body.title == null){
            erros.push({texto:'Invalid name '})
        }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto:'Invalid slug '})
        }
        if(!req.body.describe || typeof req.body.describe == undefined || req.body.describe == null){
            erros.push({texto:'Invalid describe'})
        }
    
        if(req.body.title.length < 2){
            erros.push({texto:'Short name'})
        }
        if(req.body.slug.length < 2){
            erros.push({texto:'Slug name'})
        }
        if(req.body.describe.length < 2){
            erros.push({texto:'Short describe'})

        }
        if(erros.length > 0){
            Post.findOne({_id: req.body.id}).then((posts)=>{
                res.render("editPost", { posts: posts})
            }).catch(err => {
                req.flash("error", "Failed edit to")
                res.redirect("/posts/edit")
            })
           
        } else{
            posts.title = req.body.title
            posts.slug = req.body.slug
            posts.describe = req.body.describe
            posts.content = req.body.content
            posts.category = req.body.category

            posts.save().then(()=>{
                req.flash("success", " successfully post edited")
                res.redirect("/posts")
            }).catch((err) => {
                req.flash("error", "Failed to edit")
                res.redirect("/posts/edit")
            })
            .catch((err) => {
                req.flash("error", "Error registering post")
                res.redirect("/posts/edit")
            })
        }
    
    })
})

router.post('/posts/del',user, (req,res)=>{
    Post.remove({_id:req.body.id}).then(()=>{
        req.flash('success', 'post deleted successfully!')
        res.redirect('/posts')
    }).catch(err =>{
        req.flash('error', 'error deleting post')
        res.redirect('/posts')
    })
})
    
router.get("/logout", (req,res,next)=>{
    req.logOut((err)=>{
        if(err){return next(err)}    
    req.flash('success', "logged out!")
    res.redirect('/')
    })
})




module.exports = router