
const Category=require('../model/category')
const {validationResult}=require('express-validator')
// for category
exports.Category=(req,res,next)=>{
    Category.find()
        .then((categories)=>{
            res.render('admin/categories/edit',{
                categories:categories,
                pageTitle:'Category',
                path:'/admin/category',
                editing:false,
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

// for post category
exports.postCategory=(req,res,next)=>{
    const title=req.body.category;
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return  res.render('admin/categories/edit',{
            categories:{
                title:title
            },
            pageTitle:'Category',
            path:'/admin/category',
            editing:false,
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
    })
}
    const category=new Category({
        title:title
    })
    category.save()
    .then(()=>{
        console.log("Successfully create category")
        res.redirect('/admin/category')
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)

        })
}
// for category eid
 exports.editController=(req,res,next)=>{
    const editMode=req.query.edit;
        if(!editMode){
           return res.redirect('/admin/category')
        }
        const catId=req.params.categoryId;
        Category.findById(catId)
            .then((category)=>{
                if(!category){
                  return  res.redirect('/admin/category')
                }
                res.render('admin/categories/edit',{ 
                    pageTitle:'Edit Category',
                    path:'/admin/category-edit',
                    editing:editMode,
                    category:category,
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

// post for update
exports.postEditCategory=(req,res,next)=>{
    const catId=req.body.categoryId;
    const updateTitle=req.body.category;
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return  res.render('admin/categories/edit',{
            category:{
                title:updateTitle,
                _id:catId
            },
            pageTitle:'Edit Category',
            path:'/admin/category-edit',
            editing:true,
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
    })
}
    Category.findById(catId)
        .then((category)=>{
            category.title=updateTitle;
            console.log(category.title)
           return category.save()
           .then(()=>{
               console.log("Category Update Successfully!")
               res.redirect('/admin/category')
           })
           
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)

        })
        
   
}

// for category delete
exports.deleteCategory=(req,res,next)=>{
    const catId=req.body.categoryId;
    Category.deleteMany({_id:catId})
        .then(()=>{
            console.log("Delete Category Successfully")
            res.redirect('/admin/category')
        })
        .catch(err=>console.log(err))
}

// for end category