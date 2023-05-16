module.exports = {
    user:(req,res,next)=>{

        if(req.isAuthenticated() && req.user.admin == 1){
            return next()
        } 
        req.flash('error', 'Only admin can access!')
        res.redirect('/')
        
    }
}