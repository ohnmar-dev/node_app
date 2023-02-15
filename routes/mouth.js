const express=require('express')
const router=express.Router()
const mouthController=require('../controllers/mouth')


router.get('/artical',mouthController.Artical)

router.get('/business',mouthController.Business)

router.get('/cartoon',mouthController.Cartoon)

router.get('/interview',mouthController.Interview)

router.get('/it',mouthController.IT)

router.get('/poem',mouthController.Poem)



module.exports=router