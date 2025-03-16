const express = require('express');
const router=express.Router();
let accountController = require('../app/controllers/accountController')

router.get('/getInfo', accountController.getInfo);
router.get('/login', accountController.loginpage);
router.post('/login', accountController.loginPost);
router.get('/logout', accountController.logout);

// router.get('/user', accountController.userpage);

module.exports = router;