const express =require('express');
const multer=require('multer');
const productController=require('../controllers/productcontroller.js');

const router=express.Router();


const storage=multer.memoryStorage();
const upload =multer({storage:storage});

router.post('/upload',upload.single('file'),productController.uploadProducts);
router.get('/debug/count', productController.getProductCount);

router.get('/products',productController.getAllProducts);
router.get('/products/search',productController.searchProducts);
module.exports=router;