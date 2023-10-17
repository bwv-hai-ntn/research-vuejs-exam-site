/**
 * Exam controller
 */
import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from 'http-status';
import * as factory from '../../constant/types';
import { repository } from '../../domain';
import sequelize from '../../sequelize';
import { limit, messages, Static } from './../../constant';
import { Answer } from './../../domain/model/AnswerModel';
import { Exam } from './../../domain/model/ExamModel';
import BaseController from './_baseController';

const examRepo = new repository.Exam(sequelize);
const categoryRepo = new repository.Category(sequelize);
const anwserRepo = new repository.Answer(sequelize);
const examSectionRepo = new repository.ExamSection(sequelize);
const valueList = Static;

class ExamController extends BaseController {
  public examlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: any = req.query;
      // Set default status
      if (query.status === undefined) {
        query.status = [Static.examListCheckBox.Undeleted];
      } else {
        for (let i = 0; i < query.status.length; i++) {
          if (query.status[i] === '') {
            query.status.splice(i, 1);
          }
        }
      }
      query.limit = limit;
      const exam = await examRepo.searchListExam(
        <factory.exam.searchListExam>{
          ...query,
          ...this.getOffsetLimit(req)
        },
        req.session!.admin.id,
        req.session!.admin.userFlag
      );
      const totalResult: any = exam.count;
      const categories = await categoryRepo.getCategory(
        req.session!.admin.id,
        req.session!.admin.userFlag
      );
      res.render('admin/examList', {
        layout: 'layout/adminLayout',
        valueList,
        exams: exam.rows.exams,
        totalResult: totalResult.length,
        queryData: query,
        categories
      });
    } catch (err) {
      next(err);
    }
  };

  public searchExam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query: any = req.query;
      // Set default status
      if (query.status === undefined) {
        query.status = [Static.examListCheckBox.Undeleted];
      } else {
        for (let i = 0; i < query.status.length; i++) {
          if (query.status[i] === '') {
            query.status.splice(i, 1);
          }
        }
      }
      query.status = query.status.split(',');
      query.limit = limit;
      const exam = await examRepo.searchListExam(
        <factory.exam.searchListExam>{
          ...query,
          ...this.getOffsetLimit(req)
        },
        req.session!.admin.id,
        req.session!.admin.userFlag
      );
      res.json(exam);
    } catch (error) {
      next(error);
    }
  };

  public examCreateEdit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const examId = req.params.examId;
      let deletedExamMess = '';
      let anwser: Answer[] = [];
      let examCondition: Exam | null = new Exam();
      if (examId) {
        anwser = await anwserRepo.searchAnswerByExamId(examId);
        const userId = req.session!.admin.id;
        // check exist exam
        const exam = await examRepo.findAllById(examId);
        // throw error 404
        if (!exam) {
          throw { NOT_FOUND };
        }
        // get exam data
        const userFlag = req.session!.admin.userFlag;
        examCondition = await examRepo.findByConditions(
          examId,
          userId,
          userFlag
        );
        // throw error 403
        if (!examCondition) {
          throw { FORBIDDEN };
        }
        if (examCondition?.deletedAt) {
          deletedExamMess = messages.deletedExam;
        }
      }
      let messageAfterSubmit = '';
      let backgroundColor = '';
      let bodyData: any;
      // update success
      if (req.session!.updateSuccess) {
        backgroundColor = 'success-text';
        messageAfterSubmit = req.session!.updateSuccess;
        delete req.session!.updateSuccess;
      }
      // update failed
      if (req.session!.duplicateAccessKey) {
        bodyData = req.session!.bodyData;
        delete req.session!.bodyData;
        backgroundColor = 'failed-text';
        messageAfterSubmit = req.session!.duplicateAccessKey;
        delete req.session!.duplicateAccessKey;
      }
      // success query
      res.render('admin/examCreateEdit', {
        layout: 'layout/adminLayout',
        examId,
        exam: examCondition,
        anwser: anwser.length > 0 ? anwser : null,
        deletedExamMess,
        messageAfterSubmit,
        backgroundColor,
        bodyData
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Recalculate points exam
   */
  public recalculate = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    try {
      const totalPoints = await examSectionRepo.getPointByExamId(
        req.params.examId
      );
      res.status(OK).json(totalPoints);
    } catch (error) {
      res.status(BAD_REQUEST).json(error);
    }
  };

  /**
   * check duplicate accessKey
   */
  public checkAccessKey = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    try {
      const exam = await examRepo.checkDuplicateAccessKey(
        req.params.accessKey,
        req.params.examId
      );
      res.status(OK).json(exam ? false : true);
    } catch (error) {
      res.status(BAD_REQUEST).json(error);
    }
  };

  /**
   * delete exam
   */
  public deleteExam = async (
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
      await examRepo.saveExam(req.params.examId, 'delete', {});
      // redirct to ExamList page
      res.redirect(`/admin/exam`);
    } catch (err) {
      next(err);
    }
  };

  /**
   * revert exam
   */
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
      res.redirect(`/admin/examSettings/${req.params.examId}`);
    } catch (err) {
      next(err);
    }
  };

  /**
   * update or create exam
   */
  public updateExam = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // OrderSpecChange #78350 check exist exam.accessKey
      const accessKeyData = await examRepo.checkDuplicateAccessKey(
        req.body.accessKey,
        req.params.examId
      );
      if (accessKeyData.length > 0) {
        (<Express.Session>(
          req.session
        )).duplicateAccessKey = messages.duplicateError('Access key');
        // save body data to session
        (<Express.Session>req.session).bodyData = req.body;

        if (req.params.examId) {
          return res.redirect(`/admin/examSettings/${req.params.examId}`);
        }
        return res.redirect(`/admin/examSettings`);
      }
      const params = {
        title: req.body.title ? req.body.title.replace(/\r\n/g, '\n') : null,
        description: req.body.description ? req.body.description : null,
        imagePath: req.body.imagePath ? req.body.imagePath : null,
        acceptAnswer: req.body.acceptAnswer
          ? Static.onOff.ON
          : Static.onOff.OFF,
        signinRestrict: req.body.signinRestrict
          ? Static.onOff.ON
          : Static.onOff.OFF,
        userRestrict: req.body.userRestrict ? req.body.userRestrict : null,
        limitResponse: req.body.limitResponse
          ? Static.onOff.ON
          : Static.onOff.OFF,
        testTimeSetting: req.body.testTimeSetting
          ? req.body.testTimeSetting
          : null,
        testTime: req.body.testTime ? req.body.testTime : null,
        totalPoints: req.body.totalPoints ? req.body.totalPoints : null,
        passPercentage: req.body.passPercentage
          ? req.body.passPercentage
          : null,
        showResult: req.body.showResult ? req.body.showResult : null,
        shuffleQuestion: req.body.shuffleQuestion
          ? Static.onOff.ON
          : Static.onOff.OFF,
        shuffleOption: req.body.shuffleOption
          ? Static.onOff.ON
          : Static.onOff.OFF,
        endMessage: req.body.endMessage ? req.body.endMessage : null,
        accessKey: req.body.accessKey ? req.body.accessKey : null,
        resultValidity: req.body.resultValidity ? req.body.resultValidity : null
      };

      if (req.params.examId) {
        const exam = await examRepo.findAllById(req.params.examId);
        // throw error 404
        if (!exam) {
          throw { NOT_FOUND };
        }
        await examRepo.saveExam(req.params.examId, 'update', params);
        (<Express.Session>req.session).updateSuccess =
          messages.updatedsuccessfully;
        // save examCategory
        const paramsCate: factory.exam.updateExamCategory = {
          examId: req.params.examId,
          cbxCategory: req.body.cbxCategoryData
            ? req.body.cbxCategoryData.split(',')
            : '',
          constCbxCategory: req.body.constCbxCategoryData
            ? req.body.constCbxCategoryData.split(',')
            : ''
        };
        await examRepo.saveExamCategory(paramsCate);
        // reload page
        res.redirect(`/admin/examSettings/${req.params.examId}`);
      } else {
        const exam = await examRepo.saveExam(null, 'update', params);
        // save examCategory
        const paramsCate: factory.exam.updateExamCategory = {
          examId: exam.id,
          cbxCategory: req.body.cbxCategoryData
            ? req.body.cbxCategoryData.split(',')
            : '',
          constCbxCategory: req.body.constCbxCategoryData
            ? req.body.constCbxCategoryData.split(',')
            : ''
        };
        await examRepo.saveExamCategory(paramsCate);
        // reload page
        res.redirect(`/admin/examQuestions/${exam.id}`);
      }
    } catch (err) {
      next(err);
    }
  };

  /**
   * copy exam
   */
  public copyExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exam = await examRepo.findAllById(req.params.examId);
      // throw error 404
      if (!exam) {
        throw { NOT_FOUND };
      }
      // add param for copy exam
      const params = {
        title: exam?.title ? exam?.title : null,
        description: exam?.description ? exam?.description : null,
        imagePath: exam?.imagePath ? exam?.imagePath : null,
        acceptAnswer: exam?.acceptAnswer
          ? Static.onOff.ON
          : exam?.acceptAnswer === 0
          ? Static.onOff.OFF
          : null,
        signinRestrict: exam?.signinRestrict
          ? Static.onOff.ON
          : exam?.signinRestrict === 0
          ? Static.onOff.OFF
          : null,
        userRestrict: exam?.userRestrict ? exam?.userRestrict : null,
        limitResponse: exam?.limitResponse
          ? Static.onOff.ON
          : exam?.limitResponse === 0
          ? Static.onOff.OFF
          : null,
        testTimeSetting: exam?.testTimeSetting ? exam?.testTimeSetting : null,
        testTime: exam?.testTime ? exam?.testTime : null,
        totalPoints: exam?.totalPoints ? exam?.totalPoints : null,
        passPercentage: exam?.passPercentage ? exam?.passPercentage : null,
        resultValidity: exam?.resultValidity ? exam?.resultValidity : null,
        showResult: exam?.showResult
          ? exam?.showResult
          : exam?.showResult === 0
          ? Static.afterSubmission['Show only ending message']
          : null,
        shuffleQuestion: exam?.shuffleQuestion
          ? Static.onOff.ON
          : exam?.shuffleQuestion === 0
          ? Static.onOff.OFF
          : null,
        shuffleOption: exam?.shuffleOption
          ? Static.onOff.ON
          : exam?.shuffleOption === 0
          ? Static.onOff.OFF
          : null,
        endMessage: exam?.endMessage ? exam?.endMessage : null,
        accessKey: this.generateRandomKey(10)
      };

      const examCopy = await examRepo.copyExamWithConstraints(
        req.params.examId,
        params
      );
      // reload page
      res.redirect(`/admin/examSettings/${examCopy.id}`);
    } catch (err) {
      next(err);
    }
  };

  public deleteAndRevert = async (req: Request, res: Response) => {
    const result = await examRepo.deleteAndRevert(req.body.id, req.body.flag);
    res.json(result);
  };

  public saveExamCategory = async (req: Request, res: Response) => {
    const params: factory.exam.updateExamCategory = {
      examId: req.body.examId,
      cbxCategory: req.body.cbxCategory,
      constCbxCategory: req.body.constCbxCategory
    };
    const result = await examRepo.saveExamCategory(params);
    res.json(result);
  };
}

export default new ExamController();
