const mongoose=require('mongoose');
const schema=mongoose.Schema;

const paySchema=new schema({
    date:{
        type:String,
        require:true
    },
    number:{
        type:Number,
        require:true
    },
    transactionId:{
        type:String,
        require:true
    }
})
const payModel=mongoose.model('pay',paySchema);
module.exports=payModel;