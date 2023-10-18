/**
 * Search Router
 */
import { Router } from 'express';
import SearchController from '../controllers/SearchController';
import viewHelper from '../middlewares/viewHelper';
import multer = require('multer');

const searchRouter = Router();

searchRouter.use(viewHelper);

searchRouter.get('/', SearchController.getSearch);

searchRouter.post('/delete', SearchController.delete);

const upload = multer({dest: 'public/csv/'});

searchRouter.post('/import', upload.single('file'), SearchController.import);

export default searchRouter;
