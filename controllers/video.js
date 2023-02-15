exports.Country=(req,res,next)=>{
    res.render('user/video-photo/country',{
        pageTitle:'Country',
        path:'/country'
    })
}

exports.Photo=(req,res,next)=>{
    res.render('user/video-photo/image',{
        pageTitle:'Photo',
        path:'/image'
    })
}

exports.Word=(req,res,next)=>{
    res.render('user/video-photo/m-word',{
        pageTitle:'Malitary Word',
        path:'/m-word'
    })
}


exports.Video=(req,res,next)=>{
    res.render('user/video-photo/video',{
        pageTitle:'Video Information',
        path:'/video'
    })
}



