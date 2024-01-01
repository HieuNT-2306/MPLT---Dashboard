import express from 'express';
import { getSales, getSalesByYear } from '../controllers/sales.js';

const router = express.Router();

router.get("/overallstat", getSales);
router.get("/overallstat/year/:yearParams", getSalesByYear);


export default router;