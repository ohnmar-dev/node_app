const News=require('../model/news')
const perPage=1;
exports.getIndex=(req,res,next)=>{
    const page= req.query.page || 1
        News.find()
            .countDocuments()
            .then((numNews)=>{
                totalNews=numNews
                return News.find()
                    .sort({date:-1})
                    .skip((page -1)* perPage)
                    .limit(perPage)      
                })
            .then(news=>{
                res.render('user/news/index',{
                    pageTitle:'News',
                    path:'/',
                    news:news,
                    current:page,
                    hasNextPage:perPage * page < totalNews,
                    hasPreviousPage:page > 1,
                    nextPage:page + 1,
                    previousPage:page-1,
                    lastPage:Math.ceil(totalNews / perPage)
    
                })
    
    })
        .catch(err=>console.log(err))
}


exports.Military=(req,res,next)=>{
    res.render('user/news/military',{
        pageTitle:'Military',
        path:'/military'
    })
}

exports.Rakhine=(req,res,next)=>{
    res.render('user/news/rakhine',{
        pageTitle:'Rakhine News',
        path:'/rakhine'
    })
}


exports.Women=(req,res,next)=>{
    res.render('user/news/women',{
        pageTitle:'Women News',
        path:'/women'
    })
}

exports.World=(req,res,next)=>{
    res.render('user/news/world',{
        pageTitle:'World News',
        path:'/world'
    })
}

// for read
exports.Read=(req,res,next)=>{
    const newsId=req.params.newsId
    News.findById(newsId)
        .then((oneNews)=>{
            res.render('user/news/read',{
                path:'/read',
                pageTitle:'Read',
                oneNews:oneNews
            })

        })
        .catch(err=>console.log(err))
}