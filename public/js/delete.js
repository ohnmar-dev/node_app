const deleteAll=(btn)=>{
    const catId=btn.parentNode.querySelector('[name=categoryId]').value;
    // const csrf=btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement=btn.closest('article');
    
    fetch('/admin/category/'+catId,{
        method:'delete',
        // headers:{
        //     'csrf-token':csrf
        // }
    }).then(result=>{
        return result.json();
    })
        .then(data=>{
            // productElement.remove();
            productElement.parentNode.removeChild(productElement)
            console.log(data)
        })
        .catch(err=>console.log(err))

}