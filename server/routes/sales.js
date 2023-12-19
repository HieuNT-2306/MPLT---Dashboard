import express from 'express';
import { getSales } from '../controllers/sales.js';

const router = express.Router();

router.get("/overallstat", getSales);

export default router;