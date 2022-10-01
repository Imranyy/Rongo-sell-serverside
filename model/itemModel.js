const mongoose=require('mongoose');
const schema=mongoose.Schema;
const itemSchema=new schema({
    userId:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        reqiure:true
    },
    location:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    detail:{
        type:String,
        require:true
    },
    amount:{
        type:Number,
        require:true
    },
    free:{
        type:String,
        require:true
    }
},
{
    timestamps:true
})

const itemModel=mongoose.model('item',itemSchema);
module.exports=itemModel;