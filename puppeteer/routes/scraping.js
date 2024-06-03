import express from 'express';
import { scrapLazada, scrapSendo, scrapShopee, scrapTiki } from '../controllers/scraping.js';

const router = express.Router();

router.get('/lazada/:product', scrapLazada);
router.get('/tiki/:product', scrapTiki);
router.get('/shopee/:product', scrapShopee);
router.get('/sendo/:product', scrapSendo);


export default router;