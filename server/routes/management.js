import express from 'express';
import { deleteBrand, deleteCategory, getBrands, getCategories, postBrand, postCategory, updateBrand, updateCategory } from '../controllers/management.js';

const router = express.Router();

router.post("/post/category", postCategory);
router.post("/update/category/:id", updateCategory);
router.post("/post/brand", postBrand);
router.post("/update/brand/:id", updateBrand);
router.delete("/delete/category/:id", deleteCategory);
router.delete("/delete/brand/:id", deleteBrand);
router.get("/categories", getCategories);
router.get("/brands", getBrands);


export default router;