const isLogin=async(req,res,next)=>{
    try{
      if(req.session.user){
        next();
      }else{
        res.redirect('/');
       
      }
     
    }catch(err){
        console.log(err)
    }
}

const isLogout=async (req,res,next)=>{
    try{
        if(req.session.user){
            res.redirect('/dashboard')
            
          } else{
            next();
          }
      
    }catch(err){
        console.log(err);
    }
}

module.exports={
    isLogin,
    isLogout
}