const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const path=require('path')
const session=require('express-session')
const mongoSession=require('connect-mongodb-session')(session);
const multer=require('multer')
const uuid=require('uuid')
const csrf=require('csurf');
const csrfProtection=csrf();
const cors=require('cors')
const fs=require('fs')
const flash=require('connect-flash')
const errorController=require('./controllers/error')
const authMiddleware=require('./middleware/auth')


// for admin routers
const adminRouter=require('./routes/admin')
const categoryRouter=require('./routes/category')

const authRouter=require('./routes/auth')

const MONGODB_URI='mongodb://localhost:27017/news_site'


const app=express()

const store=new mongoSession({
    uri:MONGODB_URI,
    collection:'sessions'
})

// for user routers
const newsRouter=require('./routes/news')
const mouthRouter=require('./routes/mouth')
const lifeRouter=require('./routes/lifestyle')
const vpRouter=require('./routes/video')

// for ejs 
app.set('views', 'views');
app.set('view engine', 'ejs');

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,uuid.v4()+'-'+ file.originalname)
    }

})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png' 
    || file.mimetype ==='image/jpg' 
    || file.mimetype==='image/jpeg'
    ){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

app.use(bodyParser.urlencoded({extended:false}))

app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'))

app.use(express.static(path.join(__dirname,'public')))

app.use('/images',express.static(path.join(__dirname,'images')))


//  for session
app.use(session({
    secret:'this is my secret',
    resave:false,
    saveUninitialized:false,
    store:store
    
}))
 app.use(csrfProtection);
 app.use(flash());

 app.use((req,res,next)=>{
    res.locals.isAuthentication=req.session.isLoginned;
    res.locals.csrfToken=req.csrfToken();
    next();
 })
// use routes
app.use('/admin',adminRouter,authRouter,categoryRouter)
app.use(newsRouter,mouthRouter,lifeRouter,vpRouter)

// for admin page not found
app.use('/admin',authMiddleware,errorController.Error404)
// app.get('/admin/500',authMiddleware,errorController.Error500)
// app.use((error,req,res,next)=>{
//     res.status(500).render('admin/500',{
//             pageTitle:"Server Error",
//             path:"/admin/500",
//             isAuthentication:req.session.isLoginned
            
//         })
//     })

// for user page not found
app.use(errorController.userError404)




// for mongoose 
mongoose.connect(
    MONGODB_URI,
    {useNewUrlParser:true, useUnifiedTopology:true}
).then(()=>{
    app.listen(process.env.PORT || 3000)
    console.log('Server is connecting ')
}).catch(err=>console.log(err))

 








