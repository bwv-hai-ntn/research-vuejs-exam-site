/**
 * File Router
 */
import { Router } from 'express';
import * as multer from 'multer';
import FileController from '../../controllers/admin/FileController';
const upload = multer({ storage: multer.memoryStorage() });

const FileRouter = Router();

FileRouter.post(
  '/file/upload/:type',
  upload.single('file'),
  FileController.upload
);

export default FileRouter;
