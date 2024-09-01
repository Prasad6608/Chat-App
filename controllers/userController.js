const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const bcrypt = require("bcrypt");
const user_route = require("../routes/userRoutes");


const registerLoad = async (req, res) => {
    try {
        res.render("register.ejs",{message:''});
    } catch (error) {
        console.log(error.message);
    }
};

const register = async (req, res) => {
    try{
        
       console.log(req.body.name);
    // Create and save new user
        const user = new User({
        name: req.body.name,
        email: req.body.email, // Ensure email is correctly set
        image: 'uploads/'+req.file.filename, // Use req.file.filename instead of req.file.originalname
        password: req.body.password,
})

    await user.save();

    res.render("register",{message:'user registered successfully'});
    }catch(err){
        console.log(err);
    }
}

 const loadLogin= async(req,res)=>{
    try{
        res.render("login.ejs",{message:''});
    }catch(err){
        console.log(err.message);
    }
 }

 const login =async(req,res)=>{
    try {
        const password = req.body.password;
        const userData = await User.findOne({ email: req.body.email });
    
        if (userData) {
          if (password == userData.password) {
            req.session.user = userData;
            return res.redirect("/dashboard");
          } else {
            return res.render('login', { message: 'Enter Valid Details' });
          }
        } else {
          return res.redirect('/');
        }
      } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).render('/', { message: 'An error occurred, please try again later.' });
      }
 }

const logout= async (req,res)=>{
    try{
       await req.session.destroy();
        res.redirect('/')
    }catch(err){
        console.log('1');
        console.log(err.message);
    }
}
 const loadDashboard = async (req,res)=>{
   try{
    
    const users = await User.find({ _id: { $ne: req.session.user._id } });
    
    res.render("dashboard.ejs",{user:req.session.user , users:users});
   }catch(err){
    console.log(err.message);
   }
 }

 const saveChat= async (req,res)=>{
  try{
         var chat=new Chat({
          sender_id:req.body.sender_id,
         
          receiver_id:req.body.reciever_id,
          message:req.body.message
         })
         //console.log(chat);
       var newChat= await chat.save();
       //console.log(newChat)
       res.status(200).send({success:true,msg:'chat inserted',data:newChat})
  }catch(err){
    res.status(400).send({success:false,msg:err.message})
  }
 }
module.exports = {
    register,
    registerLoad,
    loadLogin,
    login,
    loadDashboard,
    logout,
    saveChat
};
