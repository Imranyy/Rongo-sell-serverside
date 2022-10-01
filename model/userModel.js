const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    firstName:{
        type:String,
        require:true,
    },
    lastName:{
        type:String,
        require:true,
    },
    email:{
        type:String,
    },
    number:{
        type:Number,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    location:{
        type:String,
        require:true,
    },
    token:{
        type:String
    }
},{
    timestamps:true
})
const userModel=mongoose.model('user',userSchema);
module.exports=userModel;