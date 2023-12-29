import express from 'express';
import { postCategory, updateCategory } from '../controllers/management.js';

const router = express.Router();

router.post("/post/category", postCategory);
router.post("/update/category/:id", updateCategory);

export default router;