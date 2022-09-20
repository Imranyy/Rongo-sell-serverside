const mongoose=require('mongoose');
const schema=mongoose.Schema;
const itemSchema=new schema({
    image:{
        type:String,
        require:true
    },
    image1:{
        type:String,
        require:true
    },
    image2:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    text:{
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