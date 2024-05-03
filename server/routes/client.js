import express from 'express';
import {  deleteProduct, getCustomers, postCustomer, postTransaction, resetDailDataCategory, resetDataBrand, updateCustomer } from '../controllers/client.js';
import { getProducts } from '../controllers/client.js';
import { getTransactions } from '../controllers/client.js';
import { postProducts, updateProduct } from '../controllers/client.js';

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.post("/post/products", postProducts);
router.post("/post/customer", postCustomer);
router.post("/post/transaction", postTransaction);
router.post("/update/products/:id", updateProduct);
router.post("/update/customer/:id", updateCustomer);
router.delete("/delete/product/:id", deleteProduct);
router.delete("/delete/customer/:id", deleteProduct);

/*debug*/
router.post("/debug/category", resetDailDataCategory);
router.post("/debug/brand", resetDataBrand);



export default router;