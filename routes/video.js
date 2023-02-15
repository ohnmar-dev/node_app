const express=require('express')
const router=express.Router()
const videoController=require('../controllers/video')


router.get('/country',videoController.Country)

router.get('/image',videoController.Photo)

router.get('/m-word',videoController.Word)

router.get('/video',videoController.Video)




module.exports=router