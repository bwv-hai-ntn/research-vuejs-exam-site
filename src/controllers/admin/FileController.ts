/**
 * File controller
 */
import { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status';
import { repository } from '../../domain';
import sequelize from '../../sequelize';
import { deleteExistFileS3, s3FileUpload } from '../../utils/file';
import BaseController from './_baseController';

const examQuestionRepo = new repository.ExamQuestion(sequelize);

class FileController extends BaseController {
  public upload = async (req: Request, res: Response) => {
    let filePath = null;
    let columnName = 'picturePath';
    if (req.params.type === 'audio') {
      columnName = 'audioPath';
    }
    try {
      const key = `${process.env.BRANCH_NAME}/${req.body.examId}/${req.params.type}`;
      filePath = await s3FileUpload(req, key);
      // save filePath
      if (req.body.examQuestionId) {
        const examQuestion = await examQuestionRepo.model.findOne({
          where: {
            id: req.body.examQuestionId
          }
        });
        if (!examQuestion) {
          throw Error('not found.');
        }
        await examQuestionRepo.model.update(
          {
            [columnName]: filePath
          },
          { where: { id: req.body.examQuestionId } }
        );
      }
      res.json({ filePath });
    } catch (err) {
      if (filePath) {
        await deleteExistFileS3(filePath);
      }
      res.status(BAD_REQUEST).json(err.message);
    }
  };
}

export default new FileController();
