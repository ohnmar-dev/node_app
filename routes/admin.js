const express=require('express')
const router=express.Router()
const adminController=require('../controllers/admin')
const authMiddleware=require('../middleware/auth')
const {check,body}=require('express-validator')
const auth = require('../middleware/auth')



router.get('/index',authMiddleware,adminController.getIndex)

router.get('/news',authMiddleware,adminController.getNews)

router.get('/detail-news/:newsId',authMiddleware,adminController.detailNews)


router.post('/news',
[
    body('title')
        .isString()
        .isLength({min:3})
        .trim()
        .withMessage('Enter valid data'),
    body('image')
        .trim(),
    body('date','Must be a valid date')
        .isDate()
        .trim(),  
    body('description')   
        .isLength({min:5, max:400})
        .trim()

]
,authMiddleware,adminController.postNews)

router.post('/news-delete',authMiddleware,adminController.deleteNews)

router.get('/edit-news/:newsId',authMiddleware,adminController.editNews)

router.post('/edit-news',
[
    body('title')
        .isString()
        .isLength({min:3})
        .trim()
        .withMessage('Enter valid data'),
    body('date','Must be a valid date')
        .isDate()
        .trim(),
    body('description')
        .isLength({min:3,max:undefined})
        .withMessage("Description must be 3 lengths at least")
        .trim()

],
authMiddleware,adminController.postEidtNews)

router.get('/lifestyle',authMiddleware,adminController.lifeStyle)

router.post('/lifestyle',
[
    check('title')
        .isString()
        .isLength({min:3})
        .trim()
        .withMessage('Enter valid data'),
    body('image')
        .trim(),
    body('date','Must be a valid date')
        .isDate()
        .trim(),  
    check('description')
        .isLength({min:3, max:undefined})
        .withMessage("Description must be 3 lengths at least")
        .trim()

]
,authMiddleware,adminController.postLifestyle)

// for edit lifestyle
router.get('/edit-life/:lifeId',authMiddleware,adminController.editLifestyle)

router.post('/edit-life',
[
    check('title')
        .isString()
        .isLength({min:3})
        .trim()
        .withMessage('Enter valid data'),
    body('date','Must be a valid date')
        .isDate()
        .trim(),
    body('description')
        .isLength({min:3,max:undefined})
        .withMessage("Description must be 3 lengths at least")
        .trim()

]
,authMiddleware,adminController.editPostLife)

// for lifestyle delete
router.post('/delete-life',authMiddleware,adminController.deleteLifestyle)


router.get('/mouth',authMiddleware,adminController.Mouth)

router.post('/mouth',
[
    check('title')
        .isString()
        .isLength({min:3})
        .trim()
        .withMessage('Enter valid data'),
    body('image')
        .trim(),
    body('date','Must be a valid date')
        .isDate()
        .trim(),  
    check('description')
        .isLength({min:5, max:undefined})
        .withMessage("Description must be 3 lengths at least")
        .trim()

],authMiddleware,adminController.postMouth)

router.post('/delete-mouth',authMiddleware,adminController.deleteMouth)

router.get('/edit-mouth/:mouthId',authMiddleware,adminController.editMouth)

router.post('/edit-mouth',
[
    check('title')
        .isString()
        .isLength({min:3})
        .trim()
        .withMessage('Enter valid data'),
    body('date','Must be a valid date')
        .isDate()
        .trim(),
    body('description')
        .isLength({min:3,max:undefined})
        .withMessage("Description must be 3 lengths at least")
        .trim()


    ],authMiddleware,adminController.editPostMouth)



// for show news data
router.get('/show-news',authMiddleware,adminController.showNews)

// for show lifestyle data
router.get('/show-life',authMiddleware,adminController.showLife)

// for show mouth data
router.get('/show-mouth',authMiddleware,adminController.showMouth)

// for detail lifestyle
router.get('/detail-life/:lifeId',authMiddleware,adminController.lifeDetail)

// for detail mouth
router.get('/detail-mouth/:mouthId',authMiddleware,adminController.mouthDetail)

// for search
// router.get('/search-news/:newsId',authMiddleware,adminController.searchNews)
module.exports=router