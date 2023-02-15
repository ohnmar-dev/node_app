exports.Entertainment=(req,res,next)=>{
    res.render('user/lifestyle/entertainment',{
        pageTitle:'Entertainment',
        path:'/entertainment'
    })
}

exports.Food=(req,res,next)=>{
    res.render('user/lifestyle/food',{
        pageTitle:'Food',
        path:'/food'
    })
}

exports.Health=(req,res,next)=>{
    res.render('user/lifestyle/health',{
        pageTitle:'Health',
        path:'/health'
    })
}


exports.Sport=(req,res,next)=>{
    res.render('user/lifestyle/sport',{
        pageTitle:'Sport',
        path:'/sport'
    })
}

exports.Travel=(req,res,next)=>{
    res.render('user/lifestyle/travel',{
        pageTitle:'Travel',
        path:'/travel'
    })
}

