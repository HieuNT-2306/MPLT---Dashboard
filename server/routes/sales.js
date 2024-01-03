import express from 'express';
import { getSales, getSalesByYear, resetOverallStat } from '../controllers/sales.js';

const router = express.Router();

router.get("/overallstat", getSales);
router.get("/overallstat/year/:yearParams", getSalesByYear);

/*debug*/
router.post("/debug/overallstat/:yearParams", resetOverallStat);


export default router;