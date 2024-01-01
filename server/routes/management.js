import express from 'express';
import { postBrand, postCategory, updateBrand, updateCategory } from '../controllers/management.js';

const router = express.Router();

router.post("/post/category", postCategory);
router.post("/update/category/:id", updateCategory);
router.post("/post/brand", postBrand);
router.post("/update/brand/:id", updateBrand);


export default router;