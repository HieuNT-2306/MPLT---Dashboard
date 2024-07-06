import express from 'express';
import {  deleteCustomer, deleteProduct, deleteTransaction, getCustomers, postCustomer, postTransaction, resetDailDataCategory, resetDataBrand } from '../controllers/client.js';
import { getProducts } from '../controllers/client.js';
import { getTransactions } from '../controllers/client.js';
import { postProducts, updateProduct } from '../controllers/client.js';
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '..', 'temp'))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-'+ file.originalname.split(' ').join('_'))
    }
})  
const upload = multer({ storage });

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.post("/post/products", upload.single('img'), postProducts);
router.post("/post/customer", postCustomer);
router.post("/post/transaction", postTransaction);
router.post("/update/products/:id", upload.single('img'), updateProduct);
router.delete("/delete/product/:id", deleteProduct);
router.delete("/delete/customer/:id", deleteCustomer);
router.delete("/delete/transaction/:id", deleteTransaction);

/*debug*/
router.post("/debug/category", resetDailDataCategory);
router.post("/debug/brand", resetDataBrand);



export default router;