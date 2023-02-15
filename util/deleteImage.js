const fs=require('fs');
const deleteImage=(filePath)=>{
    fs.unlink(filePath,(err)=>{
        if(err){
            console.log(err)
        }
    })
}
exports.deleteImage=deleteImage;
