const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getIndexPage); //หน้า home แสดงรายการสินค้า
router.get('/add', productController.getAddProductPage); //ใช้เพิ่มสินค้า
router.post('/add', productController.postAddProduct);

module.exports = router;
