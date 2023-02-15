exports.Artical=(req,res,next)=>{
    res.render('user/mouth/artical',{
        pageTitle:'Artical',
        path:'/artical'
    })
}

exports.Business=(req,res,next)=>{
    res.render('user/mouth/business',{
        pageTitle:'Business',
        path:'/business'           
    })
}

exports.Cartoon=(req,res,next)=>{
    res.render('user/mouth/cartoon',{
        pageTitle:'Cartoons',
        path:'/cartoon'
    })
}


exports.Interview=(req,res,next)=>{
    res.render('user/mouth/interview',{
        pageTitle:'Interview',
        path:'/interview'
    })
}

exports.IT=(req,res,next)=>{
    res.render('user/mouth/it',{
        pageTitle:'IT Knowledge',
        path:'/it'
    })
}


exports.Poem=(req,res,next)=>{
    res.render('user/mouth/poem',{
        pageTitle:'Poem',
        path:'/poem'
    })
}