const express=require('express')
const {check}=require('express-validator')
const router=express.Router()
const adminController=require('../controllers/category')
const authMiddleware=require('../middleware/auth')
const {body}=require('express-validator')

// for category
router.get('/category',authMiddleware,adminController.Category)

router.post('/category',
[
    body('category','enter valid data')
        .isString()
        .isLength({min:3})
        .trim()

],authMiddleware,adminController.postCategory)

router.get('/category-edit/:categoryId',authMiddleware,adminController.editController)

router.post('/category-edit',
[
    body('category','enter valid data')
        .isString()
        .isLength({min:3})
        .trim()

]
,authMiddleware,adminController.postEditCategory)

router.post('/delete',authMiddleware,adminController.deleteCategory) 
// end for category
module.exports=router