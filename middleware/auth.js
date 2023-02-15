module.exports=(req,res,next)=>{
    if(!req.session.isLoginned){
       return res.redirect('/admin/login')
    }
    next();
}