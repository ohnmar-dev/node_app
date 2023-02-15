exports.Error404=(req,res,next)=>{
    res.status(404).render('admin/404',{
        pageTitle:'404 Error',
        path:'/admin/404',
        
        
    })
}

exports.Error500=(req,res,next)=>{
    res.status(500).render('admin/500',{
        pageTitle:'500 Server Error',
        path:'/admin/500'
    })
}


// for user error page
exports.userError404=(req,res,next)=>{
    res.status(404).render('user/404',{
        pageTitle:'404 Error',
        path:'/404',
        
        
    })
}

