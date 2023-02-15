const express=require('express')
const router=express.Router()
const authController=require('../controllers/auth')
const auth = require('../model/auth')
const authMiddleware=require('../middleware/auth')
const {check,body}=require('express-validator')

router.get('/login',authController.Login)

router.post('/login',check('email')
                .isEmail()
                .withMessage('Please, enter a valid email ')
                .normalizeEmail(),
                body('password','Please, enter a valid password')
                .isAlphanumeric()
                .isLength({min:6})
                .trim()
                ,authController.postLogin)

router.get('/register',authMiddleware,authController.Register)

router.post('/register',[check('email')
                .isEmail()
                .withMessage('Please,enter a valid email ')
                .normalizeEmail(),
                body('username')
                    .isString()
                    .isLength({min:3})
                    .trim(),
                body(
                    'password',
                    'enter password only number and text at least 6 characters'
                )
                .isAlphanumeric()
                .isLength({min:6})
                .trim(),
                body('comfirmPassword')
                .trim()
                .custom((value,{req})=>{
                    if(value !==req.body.password){
                        throw new Error('Do not match password')
                    }
                    return true;
                })

            ],

            authMiddleware,authController.postRegister)



router.get('/change-password',authMiddleware,authController.ChangePassword)


router.post('/change-password',
            [
                body('currentPassword','Please, enter current password')
                    .isAlphanumeric()
                    .isLength({min:3})
                    .trim(),
                body('newpassword','Please, enter new password')
                        .isAlphanumeric()
                        .isLength({min:3})
                        .trim(),
                body('comfirmPassword')
                        .isAlphanumeric()
                        .isLength({min:3})
                        .trim()
                        .custom((value,{req})=>{
                            if(value !== req.body.newpassword){
                                throw new Error('Do not match password')
                            }
                            return true;
                        }),
            ]
,authMiddleware,authController.postChangepassword)

router.get('/forget-password',authController.Reset)

router.post('/forget-password',
                check('email')
                .isEmail()
                .withMessage('Please , enter valid email')
,authController.postReset)

router.get('/forget-password/:token',authController.newPassword)

router.post('/new-password',
            body('password','enter password only number and text at least 6 characters')
            .isAlphanumeric()
            .isLength({min:6})
            .trim(),
            body('comfirmpassword')
                .trim()
                .custom((value,{req})=>{
                    if(value !== req.body.password){
                         throw new Error('Do not match password')
                    }
                    return true;
                })
,authController.postNewPassword)

router.post('/logout',authController.logout)

module.exports=router