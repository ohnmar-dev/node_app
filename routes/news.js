const express=require('express')
const router=express.Router()
const newsController=require('../controllers/news')


router.get('/',newsController.getIndex)

router.get('/military',newsController.Military)

router.get('/rakhine',newsController.Rakhine)

router.get('/women',newsController.Women)

router.get('/world',newsController.World)

// for read 
router.get('/read/:newsId',newsController.Read)

module.exports=router