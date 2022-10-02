const Item=require('../model/itemModel');
const User=require('../model/userModel');
const mongoose=require('mongoose');
const Pay=require('../model/payModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
require('dotenv').config()

const register=async(req,res)=>{
    const {firstName,lastName,email,number,password,location}=req.body;
      if(!firstName||!lastName||!number||!password||!location){
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
        firstName,
        lastName,
        email,
        number,
        location,
        password:hashedPassword
        
      })
      if(user){
        res.status(201).send({
            _id:user.id,
            name:`${user.firstName} ${user.lastName}`,
            location:user.location,
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
        name:`${user.firstName} ${user.lastName}`,
        location:user.location,
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
const protect=async(req,res)=>{
    let token
    try{
            if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
            //get token from headers
            token=req.headers.authorization.split(' ')[1]
            //verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            //get user from the token
            req.user=await User.findById(decoded.id).select('password');
            res.status(200).send(true);   
        }
        else if(!token){
          res.status(401).send(false);
        }
        }catch (error){
            console.log(error)
            res.status(401).send(false);
        }
  };
  
  //generate token
  const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'309d'
    })
  };

const postItem=async(req,res)=>{
    try {
        const {userId,image,phone,location,title,detail,amount,free}=req.body;
        const create=await Item.create({
            userId,
            image,
            phone,
            location,
            title,
            detail,
            amount,
            free
        })
        res.status(200).send({
            image:create.image,
            phone:create.phone,
            location:create.location,
            title:create.title,
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

const getUserItems=async(req,res)=>{
    try {
        const {userId}=req.body;
        const item=await Item.find({userId:userId})
        res.send(item);
    } catch (error) {
        res.send(error.message);
    }
}
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
          res.json('Item Deleted');
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
    deleteItem,
    patchItem,
    deleteUser,
    protect,
    postPay,
    getPay,
    getUserItems
}