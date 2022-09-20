const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();

const app= express();
//middlewares
app.use(cors({})); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//route
app.use('/api',require('./route/api'))
//listening to server when db connects
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    //listening to server
    const port=process.env.PORT||5000;
    app.listen(port,()=>{
        console.log(`server running at PORT ${port}`)
    });
}).catch((err)=>{
    console.log(err)
});

