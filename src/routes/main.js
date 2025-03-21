const express = require('express');
const router=express.Router();
let mainController = require('../app/controllers/mainController')

router.get('/product/:product_id', mainController.product);
router.get('/categories', mainController.categories);
router.get('/top', mainController.top);
router.get('/', mainController.main);


module.exports = router;