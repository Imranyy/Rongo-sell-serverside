const Item=require('../model/itemModel');
const User=require('../model/userModel');
const mongoose=require('mongoose');
const Pay=require('../model/payModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
require('dotenv').config()

const register=async(req,res)=>{
    const {name,number,password}=req.body;
      if(!name||!number||!password){
        res.status(400).send('Please add fields')
      }
      //check if user exist
      const userExist=await User.findOne({number});
      if(userExist){
        res.status(400).send('User already Exists!!')
      }
      //Hashing password 
      const salt=await bcrypt.genSalt(10)
      const hashedPassword=await bcrypt.hash(password,salt);
      //create user
      const user=await User.create({
        name,
        number,
        password:hashedPassword
        
      })
      if(user){
        res.status(201).send({
            _id:user.id,
            name:user.name,
            number:user.number,
            token:generateToken(user.id)
        })
      }else{
        res.status(400).send('Invalid User Data')
      }
};
const login=async(req,res)=>{
    const {number,password}=req.body
    const user=await User.findOne({number})
    if(user&&(await bcrypt.compare(password,user.password))){
    res.send({
        _id:user.id,
        name:user.name,
        number:user.number, 
        token:generateToken(user.id)
    })
    }else{
    res.status(400).send('Invalid Credentials')
    }
};
const deleteUser=async(req,res)=>{

};

//auth Middlerware
const protect=async(req,res,next)=>{
    let token
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        try{
            //get token from headers
            token=req.headers.authorization.split(' ')[1]
            //verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            //get user from the token
            req.user=await User.findById(decoded.id).select('password')
            next()
  
        }catch (error){
            console.log(error)
            res.status(401).send('Not Authorised☠☠')
            throw new Error('Not Authorized')
        }
    }
    if(!token){
      res.status(401).send('Not Authorised, No Token Available☠☠')
        throw new Error('Not Authorized, No Token Available')
    }
  };
  
  //generate token
  const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'309d'
    })
  };

const verify=async(req,res)=>{
    try {
        res.status(200).send(true);
    } catch (error) {
        res.status(401).send('Not Authorised☠');
    }
};
const postItem=async(req,res)=>{
    try {
        const {image,image1,image2,title,detail,amount,text,free}=req.body;
        const create=await Item.create({
            image,
            image1,
            image2,
            title,
            text,
            detail,
            amount,
            free
        })
        res.status(200).send({
            image:create.image,
            image1:create.image1,
            image2:create.image2,
            title:create.title,
            text:create.text,
            detail:create.detail,
            amount:create.amount,
            free:create.free,
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
};

const getItems=async(req,res)=>{
    try {
        const item=await Item.find({});
        res.status(200).send(item)
    } catch (error) {
        res.send(error.message)
        console.log(error.message)
    }
};

const getOneItem=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).send({error:'No such User'})
          } 
          const oneItem=await Item.findById({_id: id})
          res.status(200).send(oneItem);
    } catch (error) {
        res.status(500).send(error.message)
    }
};
//patch item
const patchItem=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).send({error:'No such User'})
          } 
          const patch=await Item.findOneAndUpdate({_id:id},{
            ...req.body
          })
          if(!patch){
            return res.status(400).send({error:'No such User'})
          }
          res.status(200).send('updated')
    } catch (error) {
        res.send(error)
    }
};
const deleteItem=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).send({error:'No such User'})
          } 
          const _deleteItem=await Item.findByIdAndDelete({_id: id})
          res.send(_deleteItem);
    } catch (error) {
        res.send(error.message);
    }
};

const postPay=async(req,res)=>{
    try {
        const {number,name,transaction_id}=req.body;
        const _postPay=await Pay.create({number,name,transaction_id});
        res.send(_postPay);
    } catch (error) {
        res.send(error);
    }
};
const getPay=async(req,res)=>{
    try {
        const {number}=req.body;
        const _getPay=await Pay.find({number:number});
        res.send(_getPay);
    } catch (error) {
        res.send(error);
    }
};
module.exports={
    postItem,
    getItems,
    getOneItem,
    register,
    login,
    verify,
    deleteItem,
    patchItem,
    deleteUser,
    protect,
    postPay,
    getPay
}