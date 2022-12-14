const express=require('express');
const router=express.Router();
const {
    postItem,
    getItems,
    getOneItem,
    getUserItems,
    register,
    login,
    deleteItem,
    deleteUser,
    patchItem,
    protect,
    postPay,
    getPay
}=require('../controller/itemController')

//post an item
router.post('/',postItem);
router.post('/register',register);
router.post('/login',login);
router.get('/verify',protect);

//get all items
router.get('/',getItems); 

//get all user item
router.post('/getUserItems',getUserItems)

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