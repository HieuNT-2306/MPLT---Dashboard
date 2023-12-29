import express from 'express';
import { getCustomers, postCustomer } from '../controllers/client.js';
import { getProducts } from '../controllers/client.js';
import { getTransactions } from '../controllers/client.js';
import { postProducts, updateProduct } from '../controllers/client.js';

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.post("/post/products", postProducts);
router.post("/post/customer", postCustomer);
router.post("/update/products/:id", updateProduct);

export default router;