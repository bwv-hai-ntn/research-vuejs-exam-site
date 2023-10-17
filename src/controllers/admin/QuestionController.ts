/**
 * Question controller
 */
import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from 'http-status';
import * as _ from 'lodash';
import { messages, Static } from '../../constant';
import { repository } from '../../domain';
import sequelize from '../../sequelize';
import { deleteExistFileS3 } from '../../utils/file';
import BaseController from './_baseController';
const examRepo = new repository.Exam(sequelize);
const examCategoryRepo = new repository.ExamCategory(sequelize);
const examSectionRepo = new repository.ExamSection(sequelize);
const examQuestionRepo = new repository.ExamQuestion(sequelize);
const examQuestionOptionRepo = new repository.ExamQuestionOption(sequelize);
const anwserRepo = new repository.Answer(sequelize);

class QuestionController extends BaseController {
  /**
   * create/edit question
   */
  public createEdit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const exam = await examRepo.findByIdForCreateEdit(req.params.examId);
      const admin = req.session!.admin;

      // throw error 404
      if (exam === null) {
        throw { NOT_FOUND };
      }

      // throw error 403
      if (admin.userFlag !== Static.authority.ADMIN) {
        const examCategory = await examCategoryRepo.checkAuthor(
          req.params.examId,
          admin.id
        );

        if (examCategory.length === 0) {
          throw { FORBIDDEN };
        }
      }
      // get anwser
      const anwser = await anwserRepo.searchAnswerByExamId(req.params.examId);
      // curren section
      let sectionPage = req.query.sectionPage || 0;
      // get examSections
      const examSections = await examSectionRepo.getByExamId(req.params.examId);
      sectionPage = examSections[Number(sectionPage)] ? sectionPage : 0;
      // get examQuestions
      let i = 0;
      for (const examSection of examSections) {
        if (i === Number(sectionPage)) {
          const questions = await examQuestionRepo.getByExamSectionId(
            examSection.id,
            Number(req.params.examId)
          );

          for (const question of questions) {
            question.questionOptions = question.examQuestionOption || [];
            question.questions = question.questionChild
              ? JSON.parse(JSON.stringify(question.questionChild))
              : [];

            for (const child of question.questions || []) {
              child.questionOptions = child.examQuestionOption || [];
            }
          }

          examSection.setDataValue('questions', questions);
        }
        i++;
      }

      res.render('admin/question/createEdit', {
        layout: 'layout/adminLayout',
        exam,
        anwser,
        examSections,
        sectionPage,
        deletedExamMess: exam.deletedAt ? messages.deletedExam : undefined
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * addSection
   */
  public addSection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // find max examSection.sort
      const maxSort = await examSectionRepo.getMaxOrder(req.params.examId);

      // insert
      await examSectionRepo.model.create({
        examId: req.params.examId,
        sort: maxSort + 1
      });

      res.redirect(
        `/admin/examQuestions/${req.params.examId}?sectionPage=${req.params.sectionsCount}`
      );
    } catch (err) {
      next(err);
    }
  };

  /**
   * Add section list popup
   */
  public addSectionPopup = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    try {
      // find max examSection.sort
      const maxSort = await examSectionRepo.getMaxOrder(req.params.examId);
      // insert
      const section = await examSectionRepo.model.create({
        examId: req.params.examId,
        sort: maxSort + 1
      });
      const getSection = await examSectionRepo.model.findOne({
        where: {
          id: section.id
        }
      });
      res.json(getSection);
    } catch (err) {
      res.status(BAD_REQUEST).json({ message: err.message });
    }
  };

  public deleteSection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const section = await examSectionRepo.model.findOne({
        where: {
          id: req.params.sectionId
        }
      });
      if (!section) {
        throw Error('not found.');
      }
      // delete
      await examSectionRepo.deleteSection(req.params.sectionId);
      if (req.query.json !== undefined) {
        res.json('ok');
      } else {
        res.redirect(`/admin/examQuestions/${req.params.examId}`);
      }
    } catch (err) {
      if (req.query.json !== undefined) {
        res.status(BAD_REQUEST).json({ message: err.message });
      } else {
        next(err);
      }
    }
  };

  public addData = async (req: Request, res: Response) => {
    try {
      let result: any = {};
      const data = req.body;
      if (data.data) {
        if (data.data.points === '') {
          data.data.points = null;
        }
        if (data.data.audioPath === '') {
          data.data.audioPath = null;
        }
        if (data.data.content === '') {
          data.data.content = null;
        }
        if (data.data.picturePath === '') {
          data.data.picturePath = null;
        }
        if (data.data.rightAnswerByText === '') {
          data.data.rightAnswerByText = null;
        }
      }
      switch (data.type) {
        case 'addQuestion':
          // find max examSection.sort
          const maxSort = await examQuestionRepo.getMaxOrder(
            data.data.examSectionId,
            data.data.higherExamQuestionId
          );
          result = await examQuestionRepo.model.create({
            ...data.data,
            sort: maxSort + 1
          });
          break;
        case 'addOption':
          const examQuestion = await examQuestionRepo.model.findOne({
            where: {
              id: data.data.examQuestionId
            }
          });
          if (!examQuestion) {
            throw Error('not found.');
          }
          // find max examSection.sort
          const maxSortOption = await examQuestionOptionRepo.getMaxOrder(
            data.data.examQuestionId
          );
          result = await examQuestionOptionRepo.model.create({
            examQuestionId: data.data.examQuestionId,
            sort: maxSortOption + 1
          });
          break;
        case 'dupplicateOption':
          const examQuestionOption = await examQuestionOptionRepo.model.findOne(
            {
              where: {
                id: data.data.idDuplidate
              }
            }
          );
          if (!examQuestionOption) {
            throw Error('not found.');
          }
          delete data.data.idDuplidate;
          result = await examQuestionOptionRepo.model.create({
            ...data.data,
            rightAnswer:
              data.data.rightAnswer === '' ? null : data.data.rightAnswer,
            sort: data.data.sort === '' ? null : data.data.sort
          });
          break;
        case 'dupplicateQuestion':
          result = await examQuestionRepo.dupplication(data.data.id);
          if (_.values(result).length <= 0) {
            throw Error('not found.');
          }
          break;
      }
      res.json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({ message: error.message });
    }
  };

  public sortData = async (req: Request, res: Response) => {
    const dataError = {
      examQuestionId: null,
      type: req.body.type
    };
    try {
      const type = req.body.type;
      const data = req.body.data;
      switch (type) {
        case 'examQuestionOption':
          dataError.examQuestionId = req.body.examQuestionId;
          for (const option of data) {
            const examOption = await examQuestionOptionRepo.model.findOne({
              where: {
                id: option.id
              }
            });
            if (!examOption) {
              throw Error('not found.');
            }
          }
          // update sort
          await examQuestionOptionRepo.model.bulkCreate(data, {
            ignoreDuplicates: true,
            updateOnDuplicate: ['sort', 'updatedAt']
          });
          break;
        case 'examQuestion':
          for (const question of data) {
            dataError.examQuestionId = question.id;
            const examQuestion = await examQuestionRepo.model.findOne({
              where: {
                id: question.id
              }
            });
            if (!examQuestion) {
              throw Error('not found.');
            }
          }
          // update sort
          await examQuestionRepo.model.bulkCreate(data, {
            ignoreDuplicates: true,
            updateOnDuplicate: ['sort', 'updatedAt']
          });
          break;
        case 'examSection':
          // update sort
          for (const section of data) {
            const examSection = await examSectionRepo.model.findOne({
              where: {
                id: section.id
              }
            });
            if (!examSection) {
              throw Error('not found.');
            }
          }
          await examSectionRepo.model.bulkCreate(data, {
            ignoreDuplicates: true,
            updateOnDuplicate: ['sort', 'updatedAt']
          });
          break;
      }

      res.json(data);
    } catch (error) {
      res.status(BAD_REQUEST).json({
        message: error.message,
        dataError
      });
    }
  };

  public updateQuestion = async (req: Request, res: Response) => {
    const transaction = await sequelize.sequelize.transaction();
    try {
      const id = req.body.id;
      const data = req.body.data;
      const result = await examQuestionRepo.model.findByPk(id);
      if (!result) {
        throw Error('not found.');
      }
      if (result) {
        // convert empty string to null
        for (const key of Object.keys(data)) {
          data[key] = data[key] === '' ? null : data[key];
        }

        // remove file S3
        if (data.picturePath !== undefined) {
          await deleteExistFileS3(result.picturePath);
        }
        if (data.audioPath !== undefined) {
          await deleteExistFileS3(result.audioPath);
        }
        // move question to other section
        if (data.examSectionId !== undefined) {
          const section = await examSectionRepo.model.findOne({
            where: {
              id: data.examSectionId
            }
          });
          if (!section) {
            throw Error('not found.');
          }
          // find max examSection.sort
          const maxSort = await examQuestionRepo.getMaxOrder(
            data.examSectionId
          );
          await examQuestionRepo.model.update(data, {
            where: { higherExamQuestionId: id },
            transaction
          });
          data.sort = maxSort + 1;
        }
        // update points when Answer type = 0: no answer
        if (Number(data.answerType) === Static.answerType['No answer']) {
          data.points = null;
          data.explanation = null;
        }
        await result.update(data, { transaction });
      }
      await transaction.commit();
      res.json(result);
    } catch (error) {
      await transaction.rollback();
      res.status(BAD_REQUEST).json({ message: error.message });
    }
  };

  public updateQuestionOption = async (req: Request, res: Response) => {
    try {
      if (req.body.multiData) {
        const multiData = req.body.multiData;
        // convert empty string to null
        for (const data of multiData) {
          for (const key of Object.keys(data)) {
            data[key] = data[key] === '' ? null : data[key];
          }
        }
        for (const data of multiData) {
          const questionOption = await examQuestionOptionRepo.model.findOne({
            where: {
              id: data.id
            }
          });
          if (!questionOption) {
            throw Error('not found.');
          }
        }
        await examQuestionOptionRepo.model.bulkCreate(multiData, {
          ignoreDuplicates: true,
          updateOnDuplicate: ['rightAnswer', 'updatedAt']
        });
        res.json(multiData);
      } else {
        const id = req.body.id;
        const data = req.body.data;
        const result = await examQuestionOptionRepo.model.findByPk(id);
        if (result) {
          // convert empty string to null
          for (const key of Object.keys(data)) {
            data[key] = data[key] === '' ? null : data[key];
          }

          await result.update(data);
        } else {
          throw Error('not found.');
        }
        res.json(result);
      }
    } catch (error) {
      res.status(BAD_REQUEST).json({ message: error.message });
    }
  };

  public updateExamSection = async (req: Request, res: Response) => {
    try {
      const id = req.body.id;
      const data = req.body.data;
      const result = await examSectionRepo.model.findByPk(id);

      if (result) {
        // convert empty string to null
        for (const key of Object.keys(data)) {
          data[key] = data[key] === '' ? null : data[key];
        }

        await result.update(data);
      } else {
        throw Error('not found.');
      }
      res.json(result);
    } catch (error) {
      res.status(BAD_REQUEST).json({ message: error.message });
    }
  };

  public removeOption = async (req: Request, res: Response) => {
    try {
      const examOption = await examQuestionOptionRepo.model.findOne({
        where: {
          id: req.params.optionId
        }
      });
      if (!examOption) {
        throw Error('not found.');
      }
      // remove option
      await examQuestionOptionRepo.model.destroy({
        where: { id: req.params.optionId }
      });
      res.json(req.params.optionId);
    } catch (error) {
      res.status(BAD_REQUEST).json(error.message);
    }
  };

  public removeQuestion = async (req: Request, res: Response) => {
    try {
      const examQuestion = await examQuestionRepo.model.findOne({
        where: {
          id: req.params.questionId
        }
      });
      if (!examQuestion) {
        throw Error('not found.');
      }
      // remove question
      await examQuestionRepo.remove(req.params.questionId);
      res.json(req.params.questionId);
    } catch (error) {
      res.status(BAD_REQUEST).json(error.message);
    }
  };

  public revertExam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const exam = await examRepo.findAllById(req.params.examId);
      // throw error 404
      if (!exam) {
        throw { NOT_FOUND };
      }
      await examRepo.saveExam(req.params.examId, 'revert', {});
      // reload page
      res.redirect(`/admin/examQuestions/${req.params.examId}`);
    } catch (err) {
      next(err);
    }
  };
}

export default new QuestionController();
