const Auth=require('../model/auth')
const bcrypt=require('bcryptjs')
const {validationResult}=require('express-validator')
const nodemailer=require('nodemailer')
const crypto=require('crypto')
const cons = require('consolidate')


const transporter=nodemailer.createTransport({
    service:"hotmail",
    auth:{
        user:"jokerchay588981@outlook.com",
        pass:"omh@OUT2020"
    }
});
// for login
exports.Login=(req,res,next)=>{
    res.render('admin/auth/login',{
        pageTitle:'Login',
        path:'/admin/login',
        isAuthentication:false,
        errorMessage:req.flash('err'),
        oldInput:{
            email:'',
            password:''
        },
        validationError:[]

        
    })
}
// end login
exports.postLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(422).render('admin/auth/login',{
            pageTitle:'Login',
            path:'/admin/login',
           errorMessage:errors.array()[0].msg,
            oldInput:{
            email:email,
            password:password
           },
           validationError:errors.array()
        })
    }
    Auth.findOne({email:email})
        .then((user)=>{
            if(!user){
                req.flash('err','Invalid email or password');
                return res.redirect('/admin/login')
            }
            bcrypt.compare(password,user.password)
            .then((match)=>{
                if(match){
                    req.session.isLoginned=true;
                    req.session.auth=match;
                   return req.session.save((err)=>{
                        console.log(err)
                        res.redirect('/admin/index')
                    })
                }
                req.flash('err','Invalid email or password')
                res.redirect('/admin/login')
        })
        .catch(err=>{
            console.log(err)
            res.redirect('/admin/login')
        })
  
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)

        })
     
}

// for logout
exports.logout=(req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/admin/login')
    })
}

// register
exports.Register=(req,res,next)=>{
    res.render('admin/auth/register',{
        pageTitle:'Register',
        path:'/admin/register',
        errorMessage:req.flash('err'),
        oldInput:{
            username:'',
            email:'',
            password:'',
            comfirmPassword:''
        },
        validationError:[]
    })
}
// end register

// for post register
exports.postRegister=(req,res,next)=>{
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(422).render('admin/auth/register',{
            pageTitle:'Register',
            path:'/admin/register',
            errorMessage:errors.array()[0].msg,
            oldInput:{
                username:username,
                email:email,
                password:password,
                comfirmPassword:req.body.comfirmPassword
            },
            validationError:errors.array()

        })
    }
    Auth.findOne({email:email})
        .then((user)=>{
            if(user){
              req.flash('err','E-mail is already exist')
              return  res.redirect('/admin/register')
            }
             bcrypt.hash(password,12)  
             .then((hashPassword)=>{
                 const auth=new Auth({
                     username:username,
                     email:email,
                     password:hashPassword
                 })
                 auth.save()
             })
             .then(()=>{
                 console.log("Register successfully")
                 res.redirect('/admin/login')
                 transporter.sendMail({
                    from:'jokerchay588981@outlook.com',
                    to:email,
                    subject:"Successfully for Register",
                    html:'<h1>Successfully for Register</h1>'
                 })
             })
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)

        })
}


exports.ChangePassword=(req,res,next)=>{
    res.render('admin/auth/change-password',{
        pageTitle:'Change Password',
        path:'/admin/change-password',
        errorMessage:null,
        validationErrors:[],
        passwords:{
            currentPassword:'',
            newPassword:'',
            comfirmPassword:''
        }
       
    })
}


exports.postChangepassword=(req,res,next)=>{
    let session=req.session;
    if(session.email){
        const old_password=req.body.currentPassword;
        const new_password=req.body.newpassword;
        const confirm_password=req.body.comfirmPassword;
        Auth.findOne({"email":session.email},(err,user)=>{
            if(user != null){
                const hash=user.password;
                bcrypt.compare(old_password,hash,(err,res)=>{
                    if(res){
                        if(new_password == confirm_password){
                            bcrypt.hash(new_password,12,(err,hash)=>{
                                user.password=hash;
                                user.save((err,user)=>{
                                    if(err){
                                        return console.log(err);
                                    } 
                                       res.redirect('/admin/change-password')
                                        console.log("successfully change password")
                                    
                                })
                            })
                        }
                    }else{
                        console.log("Password donot match")
                    }

                })
            }
        })
    }else{
        // res.render('error',{message:"you are not logged in"})
        console.log("you are not logged in")
    }
}


// forget password
exports.Reset=(req,res,next)=>{
    res.render('admin/auth/forgetPassword',{
        pageTitle:'forget Password',
        path:'/admin/forget-password',
        errorMessage:req.flash('error'),
        validationErrors:[]
       
        
     
    })
}

exports.postReset=(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).render('admin/auth/forgetPassword',{
            pageTitle:'forget Password',
            path:'/admin/forget-password',
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
        })
    }
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            return res.redirect('/admin/forget-password')
        }
    const token=buffer.toString('hex')
    Auth.findOne({email:req.body.email})
        .then((auth)=>{
            if(!auth){
                req.flash('error','No found account with user email')
                return res.redirect('/admin/forget-password')    
            }
            auth.resetToken=token;
            auth.resetExpirationDate=Date.now()+3600000;
            return auth.save()
        })
        .then(()=>{
            res.redirect('/admin/forget-password')
            transporter.sendMail({
                from:"jokerchay588981@outlook.com",
                to:req.body.email,
                subject:'your forget password link',
                html:`
                <h1>You requested a forget password</h1>
                <p>Click this <a href="http://localhost:3000/admin/forget-password/${token}">link</a></p>
                `   
            })
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)

        })
    })
    
}

// for new password
exports.newPassword=(req,res,next)=>{
    const token=req.params.token;
    Auth.findOne({resetToken:token,resetExpirationDate:{$gt:Date.now()}})
        .then((user)=>{
            res.render('admin/auth/new-password',{
                pageTitle:'New Password',
                path:'/admin/new-password',
                errorMessage:null,
                userId:user._id.toString(),
                passwordToken:token,
                validationErrors:[]
               
            })
        })
        .catch(err=>{
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error)

        })
}

exports.postNewPassword=(req,res,next)=>{
    const newPassword=req.body.password;
    const userId=req.body.userId;
    const passwordToken=req.body.passwordToken;
    const comfirmPassword=req.body.comfirmPassword;
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).render('admin/auth/new-password',{
            pageTitle:'New Password',
            path:'/admin/new-password',
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array(),
            userId:userId,
            passwordToken:passwordToken
        })
    }

    Auth.findOne({
        resetToken:passwordToken,
        resetExpirationDate:{$gt:Date.now()},
        _id:userId
    })
    .then((user)=>{
        resetUser=user;
      return  bcrypt.hash(newPassword,12)

    })
    .then((hashPassword)=>{
        resetUser.password=hashPassword
        resetUser.resetToken=undefined,
        resetUser.resetExpirationDate=undefined
        return resetUser.save()
    })
    .then(()=>{
        res.redirect('/admin/login')
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error)

    })

}