import express from 'express';
import { scrapBeautyBox, scrapHasaki, scrapLazada, scrapSendo, scrapTiki } from '../controllers/scrap.js';

const router = express.Router();

// router.get('/lazada/id=:id&num=:num', scrapLazada);
// router.get('/tiki/id=:id&num=:num', scrapTiki);
// router.get('/sendo/id=:id&num=:num', scrapSendo);
router.post('/lazada/id=:id&num=:num', scrapLazada);
router.post('/tiki/id=:id&num=:num', scrapTiki);
router.post('/sendo/id=:id&num=:num', scrapSendo);
router.post('/hasaki/id=:id&num=:num', scrapHasaki);
router.post('/beautybox/id=:id&num=:num', scrapBeautyBox);

//debug
// router.get('/all/:product', scrapAll);


export default router;