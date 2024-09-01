require('dotenv').config();
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat');
const express=require('express');
const app=require('express')();
const http=require('http').Server(app);
const userRoutes=require('./routes/userRoutes');
 const User=require('./models/userModel');

 const Chat = require("./models/chatModel");

app.use("/", userRoutes);


const io=require('socket.io')(http);
var usp=io.of('/user-namespace');

usp.on('connection' , async function (socket){
    var userId=socket.handshake.auth.token;
    console.log('user connected');
    await  User.findByIdAndUpdate({_id:userId} , {$set : { is_online: '1' }});

    //broadcast That User Has Joined
    socket.broadcast.emit('getOnlineUser' , { user_id:userId});

    socket.on('disconnect' , async function(){

        console.log('user disconnected');
        await  User.findByIdAndUpdate({_id:userId} , {$set : { is_online: '0' }});
        socket.broadcast.emit('getOfflineUser' , { user_id:userId});
    });

    socket.on('newChat',(data)=>{
    socket.broadcast.emit('loadNewChat',data);
    })
    
    socket.on('existsChat',async function(data){
    var chats=   await Chat.find({ $or:[
        {sender_id:data.sender_id,receiver_id:data.reciever_id},
        {sender_id:data.reciever_id,receiver_id:data.sender_id}
    ]});

    socket.emit('loadChats',{chats:chats});
    })
})

http.listen(3000,()=>{
    console.log("server is running on port 3000");
})
