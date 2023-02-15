const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const newsSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category',
    }
   
})

module.exports=mongoose.model("News",newsSchema)