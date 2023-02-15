
const Lifestyle=require('../model/lifestyle')
const Mouth=require('../model/mouth')
const News=require('../model/news')
const Category=require('../model/category')
const fileImage=require('../util/deleteImage')
const {validationResult}=require('express-validator')
const category = require('../model/category')
const perPage=10;

exports.getIndex=(req,res,next)=>{
    res.render('admin/index',{
        pageTitle:'Admin Index',
        path:'/admin/index',
    })
}
// for news
exports.getNews=(req,res,next)=>{
    res.render('admin/posts/news',{
        pageTitle:'News',
        path:'/admin/news',
        editing:false,
        hasError:false,
        errorMessage:null,
        validationErrors:[]  
    })
}

// detail news
exports.detailNews=(req,res,next)=>{
    const newsId=req.params.newsId
    News.findById(newsId)
        .then((oneNews)=>{
            res.render('admin/posts/news-detail',{
                oneNews:oneNews,
                pageTitle:oneNews.title,
                path:'/admin/detail-news'
            })
        })
        .catch(err=>console.log(err))

}
// for news post
exports.postNews=(req,res,next)=>{
    const title=req.body.title;
    const image=req.file; 
    const date=req.body.date;
    const description=req.body.description;
    const errors=validationResult(req)
    if(!image){
        return res.status(422).render('admin/posts/news',{
            pageTitle:'News',
            path:'/admin/news',
            editing:false,
            hasError:true,
            oneNew:{
                title:title,
                date:date,
                description:description
            },
            errorMessage:'do not match image',
            validationErrors:[]
        })
    }
    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(422).render('admin/posts/news',{
            pageTitle:'News',
            path:'/admin/news',
            hasError:true,
            editing:false,
            oneNew:{
                title:title,
                image:image,
                date:date,
                description:description,
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
        })
    }
  
      
    const imageUrl=image.path;
    const postNews=new News({
            title:title,
            image:imageUrl,
            date:date,
            description:description,
           
    })
    postNews.save()
        .then(()=>{
            console.log("Successfully News Created")
            res.redirect('/admin/news')
        })
       
        .catch(err=>console.log(err))
}

// for delete news
exports.deleteNews=(req,res,next)=>{
    const newsId=req.body.newsId;
    News.findById(newsId)
        .then((onenews)=>{
            if(!onenews){
               return res.redirect('/admin/show-news') 
            }
            fileImage.deleteImage(onenews.image);
           return News.deleteMany({_id:newsId})
        })
        .then(()=>{
            console.log("delete successfully!")
            res.redirect('/admin/show-news')
        })
        .catch(err=>console.log(err))
}


// for edit news
exports.editNews=(req,res,next)=>{
    const editMode=req.query.edit
    if(!editMode){
        return res.redirect('/admin/news')
    }
    const newsId=req.params.newsId;
    News.findById(newsId)
        .then((oneNew)=>{
            res.render('admin/posts/news',{
                pageTitle:"Edit News",
                path:'/admin/edit-news',
                editing:editMode,
                oneNew:oneNew,
                hasError:false,
                errorMessage:null,
                validationErrors:[]
               
             
                
            })
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)

        })
}


// for post edit news
exports.postEidtNews=(req,res,next)=>{
    const updateTitle=req.body.title;
    const image=req.file;
    const updateDate=req.body.date;
    const updateDescription=req.body.description;
    const newsId=req.body.newsId;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(422).render('admin/posts/news',{
            pageTitle:'Edit News',
            path:'/admin/edit-news',
            errorMessage:errors.array()[0].msg,
            editing:true,
            oneNew:{
                title:updateTitle,
                date:updateDate,
                description:updateDescription,
                _id:newsId
            },
            validationErrors:errors.array()
        })
    }
    News.findById(newsId)
        .then((oneNew)=>{
            oneNew.title=updateTitle;
            oneNew.date=updateDate;
            oneNew.description=updateDescription;
            if(image){
                fileImage.deleteImage(oneNew.image);
                oneNew.image=image.path;
            }
            return oneNew.save()
                .then(()=>{
                    console.log("Update News Successfully")
                    res.redirect('/admin/show-news')
                    })
                    .catch(err=>{
                        const error=new Error(err);
                        error.httpStatusCode=500;
                        return next(error)
            
                    })
        })
}

// for lifestyle
exports.lifeStyle=(req,res,next)=>{
    res.render('admin/posts/lifestyle',{
        pageTitle:'Life-Style',
        path:'/admin/lifestyle',
        editing:false,
        errorMessage:null,
        validationErrors:[]
      
    })

} 

// for post lifestyle
exports.postLifestyle=(req,res,next)=>{
    const title=req.body.title;
    const image=req.file;
    const date=req.body.date;
    const description=req.body.description
    const errors=validationResult(req)
    if(!image){
       return res.status(422).render('admin/posts/lifestyle',{
        pageTitle:'Life-Style',
        path:'/admin/lifestyle',
        editing:false,
        lifestyles:{
            title:title,
            date:date,
            description:description                  
        },
            errorMessage:'do not match image',
            validationErrors:errors.array()

       })
    }

    if(!errors.isEmpty()){
      return  res.status(422).render('admin/posts/lifestyle',{
        pageTitle:'Life-Style',
        path:'/admin/lifestyle',
        lifestyles:{
            title:title,
            date:date,
            image:image,
            description:description
        },
        editing:false,
        errorMessage:errors.array()[0].msg,
        validationErrors:errors.array()
        

      })
    }
    const imageUrl=image.path
    const lifeStyle=new Lifestyle({
        title:title,
        image:imageUrl,
        date:date,
        description:description
    })
    lifeStyle.save()
        .then(()=>{
            console.log("Created lifestyle successfully")
            res.redirect('/admin/lifestyle')
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)

        })
}
// for edit lifestyle
exports.editLifestyle=(req,res,next)=>{
    const editMode=req.query.edit;
       if(!editMode){
        return res.redirect('/admin/lifestyle')
       }
       const lifeId=req.params.lifeId;
        Lifestyle.findById(lifeId)
            .then((life)=>{
                res.render('admin/posts/lifestyle',{
                    pageTitle:'Edit Lifestyle',
                    path:'/admin/edit-life',
                    editing:editMode,
                    life:life,
                    errorMessage:null,
                    validationErrors:[]
                  
                })
            })
            .catch(err=>{
                const error=new Error(err);
                error.httpStatusCode=500;
                return next(error)
    
            })
}
// for edit post lifestyle
exports.editPostLife=(req,res,next)=>{
    const updateTitle=req.body.title;
    const image=req.file;
    const updateDate=req.body.date;
    const updateDescription=req.body.description;
    const lifeId=req.body.lifeId;
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return  res.status(422).render('admin/posts/lifestyle',{
          pageTitle:'Edit Lifestyle',
          path:'/admin/edit-life',
          life:{
              title:updateTitle,
              date:updateDate,
              description:updateDescription,
              _id:lifeId
          },
          editing:true,
          errorMessage:errors.array()[0].msg,
          validationErrors:errors.array()
          
  
        })
      }
        Lifestyle.findById(lifeId)
            .then((life)=>{
                life.title=updateTitle;
                life.date=updateDate;
                life.description=updateDescription;
                if(image){
                    fileImage.deleteImage(life.image)
                    life.image=image.path
                }
                return life.save()
                    .then(()=>{
                        console.log("Update Successfully for LifeStyle")
                        res.redirect('/admin/show-life')
                    })
                
            })
            .catch(err=>{
                const error=new Error(err);
                error.httpStatusCode=500;
                return next(error)
    
            })
}

// for delete lifestyle
exports.deleteLifestyle=(req,res,next)=>{
    const lifeId=req.body.lifeId;
    Lifestyle.findById(lifeId)
        .then((life)=>{
            if(!life){
                return res.redirect('/admin/show-life')
            }
            fileImage.deleteImage(life.image)
           return  Lifestyle.deleteMany({_id:lifeId})

        })
        .then(()=>{
            console.log("delete successfully for life")
            res.redirect('/admin/show-life')
        })
        .catch(err=>console.log(err))
}

// detail news
exports.lifeDetail=(req,res,next)=>{
    const lifeId=req.params.lifeId
    Lifestyle.findById(lifeId)
        .then((life)=>{
            res.render('admin/posts/life-detail',{
                pageTitle:life.title,
                path:'/admin/detail-life',
                life:life
            })
        })
        .catch(err=>{
            const error=new Error(err)
            error.httpStatusCode=500;
            return next(error)
        })

}

// for mouth
exports.Mouth=(req,res,next)=>{
    res.render('admin/posts/mouth',{
        pageTitle:'Mouth',
        path:'/admin/mouth',
        editing:false,
        errorMessage:null,
        validationErrors:[]
      
    })
} 

// for mouth post
exports.postMouth=(req,res,next)=>{
    const title=req.body.title;
    const date=req.body.date;
    const image=req.file;
    const description=req.body.description;
    const errors=validationResult(req)
    if(!image){
        res.status(422).render('admin/posts/mouth',{
            path:'/admin/mouth',
            pageTitle:"Mouth",
            editing:false,
            mouths:{
                title:title,
                date:date,
                description:description
            },
            errorMessage:'do not match image',
            validationErrors:errors.array()

        })
    }
    if(!errors.isEmpty()){
        return  res.status(422).render('admin/posts/mouth',{
          pageTitle:'Mouth',
          path:'/admin/mouth',
          editing:false,
          mouths:{
              title:title,
              date:date,
              image:image,
              description:description
          },
          editing:false,
          errorMessage:errors.array()[0].msg,
          validationErrors:errors.array()
          
  
        })
      }
    const imageUrl=image.path
       const mouth=new Mouth({
        title:title,
        date:date,
        description:description,
        image:imageUrl
       })
       mouth.save()
        .then(()=>{
            console.log("Created successfully for mouth")
            res.redirect('/admin/mouth')
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)

        })
}

exports.editMouth=(req,res,next)=>{
    const editMode=req.query.edit;
        if(!editMode){
            return res.redirect('/admin/mouth')
        }
        const mouthId=req.params.mouthId
        Mouth.findById(mouthId)
            .then((mouth)=>{
                res.render('admin/posts/mouth',{
                    pageTitle:"Edit Mouth",
                    path:"/admin/edit-mouth",
                    editing:editMode,
                    mouth:mouth,
                    errorMessage:null,
                    validationErrors:[]
                   
                })
            })
            .catch(err=>{
                const error=new Error(err);
                error.httpStatusCode=500;
                return next(error)
    
            })
}

exports.editPostMouth=(req,res,next)=>{
    const updateTitle=req.body.title;
    const updateDate=req.body.date;
    const updateDescription=req.body.description;
    const image=req.file;
    const mouthId=req.body.mouthId;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return  res.status(422).render('admin/posts/mouth',{
            pageTitle:"Edit Mouth",
            path:"/admin/edit-mouth",
            editing:true,
            mouth:{
                title:updateTitle,
                date:updateDate,
                description:updateDescription,
                image:image
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
            
    })
}
    Mouth.findById(mouthId)
        .then((mouth)=>{
            mouth.title=updateTitle;
            mouth.date=updateDate;
            mouth.description=updateDescription;
            if(image){
                fileImage.deleteImage(mouth.image)
                mouth.image=image.path;
            }
            
            return mouth.save()
                .then(()=>{
                    console.log("Update Successfully for Mouth")
                    res.redirect('/admin/show-mouth')
                })

        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)

        })

}

// for delete mouth
exports.deleteMouth=(req,res,next)=>{
    const mouthId=req.body.mouthId;
        Mouth.findById(mouthId)
            .then((mouth)=>{
                if(!mouth){
                 return   res.redirect('/admin/show-mouth')
                }
                fileImage.deleteImage(mouth.image)
              return  Mouth.deleteMany({_id:mouthId})   
            })
            .then(()=>{
                console.log("delete Successfully for mouth")
                res.redirect('/admin/show-mouth')
            })
            .catch(err=>console.log(err))
            
}


// show data news
exports.showNews=(req,res,next)=>{
    let totalNews;
    const page= +req.query.page || 1
    News.find()
        .countDocuments()
        .then((numNews)=>{
             totalNews=numNews
            return News.find()
                .sort({date:-1})
                .skip((page -1)* perPage)
                .limit(perPage)      
             })
            .then((news)=>{
                res.render('admin/posts/show-news',{
                    pageTitle:'News',
                    path:'/admin/show-news',
                    news:news,
                    current:page,
                    hasNextPage:perPage * page < totalNews,
                    hasPreviousPage:page > 1,
                    nextPage:page + 1,
                    previousPage:page-1,
                    lastPage:Math.ceil(totalNews / perPage)
 
            })
        })
       .catch(err=>{
         const error=new Error(err)
         error.httpStatusCode=500
         return next(error)
       })
}

exports.showLife=(req,res,next)=>{ 
    let totalLifes;
    const page= +req.query.page || 1
    Lifestyle.find()
        .countDocuments()
        .then((numLifes)=>{
            totalLifes=numLifes
            return Lifestyle.find()
                .sort({date:-1})
                .skip((page -1)* perPage)
                .limit(perPage)      
             })
            .then((lifestyles)=>{
                res.render('admin/posts/show-life',{
                    pageTitle:'Life-Style',
                    path:'/admin/show-life',
                    lifestyles:lifestyles,
                    current:page,
                    hasNextPage:perPage * page < totalLifes,
                    hasPreviousPage:page > 1,
                    nextPage:page + 1,
                    previousPage:page-1,
                    lastPage:Math.ceil(totalLifes / perPage)
 
            })
        })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error)

    })
}

exports.showMouth=(req,res,next)=>{
    let totalMouth;
    const page= +req.query.page || 1
    Mouth.find()
        .countDocuments()
        .then((numMouths)=>{
            totalMouth=numMouths
            return Mouth.find()
                .sort({date:-1})
                .skip((page -1)* perPage)
                .limit(perPage)      
             })
            .then((mouths)=>{
                res.render('admin/posts/show-mouth',{
                    pageTitle:'Mouth',
                    path:'/admin/show-mouth',
                    mouths:mouths,
                    current:page,
                    hasNextPage:perPage * page < totalMouth ,
                    hasPreviousPage:page > 1,
                    nextPage:page + 1,
                    previousPage:page-1,
                    lastPage:Math.ceil(totalMouth / perPage)
 
            })
        })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error)

    })
}


// for detail mouth
exports.mouthDetail=(req,res,next)=>{
    const mouthId=req.params.mouthId;
    Mouth.findById(mouthId)
        .then((mouth)=>{
            res.render('admin/posts/mouth-detail',{
                pageTitle:mouth.title,
                path:'/admin/detail-mouth',
                mouth:mouth
            })
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)
        })
}


// for search
// exports.searchNews=(req,res,next)=>{
//     const {name}=req.query;
//     News.find({
//         title:{
//             $regex:name,
//             $options:"hello "
//         }
//     })
//     .then(title=>{
//         res.redirect('admin/posts/news',{
//             news:title,
//             pageTitle:"Search",
//             path:'/admin/search-news'
//         })
      
//     })
//     .catch(err=>console.log(err))
// }