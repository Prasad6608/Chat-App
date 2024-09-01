const mongoose=require('mongoose');

const chatSchema=mongoose.Schema({
   
    sender_id:{
        type:String,
        required:true
    },

    receiver_id:{
        type:String,
        required:true
    },

    message:{
        type:String,
        required:true
    },
}
,
     {timestamps:true}
)

module.exports=mongoose.model('Chat',chatSchema);