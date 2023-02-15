const express=require('express')
const router=express.Router()
const lifeController=require('../controllers/lifestyle')


router.get('/entertainment',lifeController.Entertainment)

router.get('/food',lifeController.Food)

router.get('/health',lifeController.Health)

router.get('/sport',lifeController.Sport)


router.get('/travel',lifeController.Travel)



module.exports=router