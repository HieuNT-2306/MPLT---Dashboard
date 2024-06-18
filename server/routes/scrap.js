import express from 'express';
import { scrapLazada, scrapSendo, scrapTiki } from '../controllers/scrap.js';

const router = express.Router();

router.get('/lazada/id=:id&num=:num', scrapLazada);
router.get('/tiki/id=:id&num=:num', scrapTiki);
router.get('/sendo/id=:id&num=:num', scrapSendo);

//debug
// router.get('/all/:product', scrapAll);


export default router;