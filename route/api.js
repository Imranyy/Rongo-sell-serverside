const express=require('express');
const router=express.Router();
const {
    postItem,
    getItems,
    getOneItem,
    register,
    login,
    verify,
    deleteItem,
    deleteUser,
    patchItem,
    protect,
    postPay,
    getPay
}=require('../controller/itemController')

//post an item
router.post('/',postItem)
router.post('/register',register);
router.post('/login',login);
router.get('/verify',protect,verify);

//get all items
router.get('/',getItems); 

//pay
router.post('/pay',postPay)
router.post('/getPay',getPay)

//patch item
router.patch('/:id',patchItem)

//get single item
router.get('/:id',getOneItem);
router.delete('/:id',deleteItem);
router.delete('/:user_id',deleteUser);

module.exports=router;