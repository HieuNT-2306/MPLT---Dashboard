import express from 'express';
import { scrapAll, scrapLazada, scrapSendo, scrapTiki } from '../controllers/scraping.js';

const router = express.Router();

router.get('/lazada/:product', scrapLazada);
router.get('/tiki/:product', scrapTiki);
router.get('/sendo/:product', scrapSendo);
router.get('/all/:product', scrapAll);


export default router;