import express from 'express';
import { scrapHasaki, scrapLazada, scrapSendo, scrapTiki } from '../controllers/scrap.js';

const router = express.Router();

router.post('/lazada/id=:id&num=:num', scrapLazada);
router.post('/tiki/id=:id&num=:num', scrapTiki);
router.post('/sendo/id=:id&num=:num', scrapSendo);
router.post('/hasaki/id=:id&num=:num', scrapHasaki);



export default router;