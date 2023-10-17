/**
 * Anwswer controller
 */
import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from 'http-status';
import * as moment from 'moment';
import { repository } from '../../domain';
import sequelize from '../../sequelize';
import { sendByEmail } from '../../utils/sendEmail';
import { limit, messages, Static, types } from './../../constant';
import BaseController from './_baseController';

const answerRepo = new repository.Answer(sequelize);
const examRepo = new repository.Exam(sequelize);
const examSectionRepo = new repository.ExamSection(sequelize);
const examQuestionRepo = new repository.ExamQuestion(sequelize);

class AnswerController extends BaseController {
  public answerlist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.header(
        'Cache-Control',
        'private, no-cache, no-store, must-revalidate'
      );
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      if (
        req.params.examId === null ||
        req.params.examId === undefined ||
        req.params.examId === ''
      ) {
        throw { NOT_FOUND };
      }
      // step 1: check parameter:examId exists and get exam
      const exam = await examRepo.getExam(req.params.examId);
      if (req.session!.admin.userFlag !== Static.authority.ADMIN) {
        // step 2: check access permisstion
        const examCondition = await examRepo.findByConditions(
          exam.id,
          req.session!.admin.id,
          req.session!.admin.userFlag
        );
        // throw error 403
        if (!examCondition) {
          throw { FORBIDDEN };
        }
      }
      let deletedExamMess;
      if (exam!.deletedAt) {
        deletedExamMess = messages.deletedExam;
      }
      // step 3: get and show data answer
      const query: any = req.query;
      const conditions = req.session?.conditionsAnswerList;
      if (conditions) {
        query.status = conditions.status;
        query.result = conditions.result;
        query.examName = conditions.examName;
        query.examEmail = conditions.examEmail;
        query.totalFrom = conditions.totalFrom;
        query.totalTo = conditions.totalTo;
        query.percentageFrom = conditions.percentageFrom;
        query.percentageTo = conditions.percentageTo;
      } else {
        // Set default status
        if (query.status === undefined) {
          query.status = [Static.examStatusAnswer.Completed];
        } else {
          for (let i = 0; i < query.status.length; i++) {
            if (query.status[i] === '') {
              query.status.splice(i, 1);
            }
          }
        }
      }
      // Bug_IT_BV #81020
      const answersNotLimit = await answerRepo.searchAnswerList(<
        types.answer.searchListAnswer
      >{
        examId: req.params.examId,
        ...query
      });
      query.limit = limit;
      const answers = await answerRepo.searchAnswerList(<
        types.answer.searchListAnswer
      >{
        examId: req.params.examId,
        ...query
      });
      const arrIdAnswer = answersNotLimit.rows.map((answer) => answer.id);
      const countCompleted = await answerRepo.countConditionAnswer(arrIdAnswer);
      const countPassed = await answerRepo.countConditionAnswer(
        arrIdAnswer,
        true
      );
      const calculate =
        countCompleted === 0
          ? 0
          : Math.round((countPassed / countCompleted) * 100);
      const strPassedAnswers = countPassed + ` (${calculate}%)`;
      res.render('admin/answerList', {
        layout: 'layout/adminLayout',
        queryData: query,
        answers,
        exam,
        examId: req.params.examId,
        deletedExamMess,
        countCompleted,
        strPassedAnswers
      });
    } catch (err) {
      next(err);
    }
  };

  public searchAnswerlist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query: any = req.query;
      for (let i = 0; i < query.status.length; i++) {
        if (query.status[i] === '') {
          query.status.splice(i, 1);
        }
      }
      for (let i = 0; i < query.result.length; i++) {
        if (query.result[i] === '') {
          query.result.splice(i, 1);
        }
      }
      query.status = query.status !== '' ? query.status.split(',') : '';
      query.result = query.result !== '' ? query.result.split(',') : '';
      // Bug_IT_BV #81020
      const answersNotLimit = await answerRepo.searchAnswerList(<
        types.answer.searchListAnswer
      >{
        ...query,
        ...this.getOffsetLimit(req)
      });
      query.limit = limit;
      // save conditions to session
      (<Express.Session>req.session).conditionsAnswerList = query;
      const answers = await answerRepo.searchAnswerList(<
        types.answer.searchListAnswer
      >{
        ...query,
        ...this.getOffsetLimit(req)
      });
      const arrIdAnswer = answersNotLimit.rows.map((answer) => answer.id);
      const countCompleted = await answerRepo.countConditionAnswer(arrIdAnswer);
      const countPassed = await answerRepo.countConditionAnswer(
        arrIdAnswer,
        true
      );
      const calculate =
        countCompleted === 0
          ? 0
          : Math.round((countPassed / countCompleted) * 100);
      const strPassedAnswers = countPassed + ` (${calculate}%)`;
      res.json({
        ...answers,
        countCompleted,
        strPassedAnswers
      });
    } catch (err) {
      next(err);
    }
  };

  public deleteAnswer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await answerRepo.deleteAnswer(req.params.answerId);
      res.send(OK);
    } catch (err) {
      next(err);
    }
  };

  /**
   * revert exam on screen answer list
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
      res.redirect(`/admin/answer/${req.params.examId}`);
    } catch (err) {
      next(err);
    }
  };

  public answerView = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const answerId = req.params.answerId;
      const userFlag = req.session!.admin.userFlag;
      const userId = req.session!.admin.id;
      let deletedExamMess = null;
      // throw error 404
      if (!answerId) {
        throw { NOT_FOUND };
      }
      // get answerId form session
      const answerIdSession = req.session!.answerId;
      if (answerIdSession && Number(answerIdSession) !== Number(answerId)) {
        delete req.session!.answerId;
        res.clearCookie('currentPageView');
        res.redirect(`/admin/answer/${answerId}/view`);
      }
      // check exist answer
      const answer = await answerRepo.findById(answerId);
      // throw error 404
      if (!answer) {
        throw { NOT_FOUND };
      }
      const examId = answer?.examId ? answer?.examId : '';
      // get exam data
      const exam = await examRepo.findByConditions(examId, userId, userFlag);
      // throw error 403
      if (!exam) {
        throw { FORBIDDEN };
      }
      if (exam?.deletedAt) {
        deletedExamMess = messages.deletedExam;
      }
      const currentPageView = req.cookies.currentPageView || 0;
      // get all examSection
      const examSections = await examSectionRepo.getByExamId(examId.toString());
      // get examQuestions
      let i = 0;
      for (const examSection of examSections) {
        if (i === Number(currentPageView)) {
          examSection.examQuestions = await examQuestionRepo.getByExamSectionId(
            examSection.id,
            answer?.id
          );
        }
        i++;
        examSection.examQuestionsPopup = await examQuestionRepo.getByExamSectionId(
          examSection.id,
          answer?.id
        );
      }
      // save answerId to session
      (<Express.Session>req.session).answerId = answer.id;
      res.render('admin/answerView', {
        layout: 'layout/adminLayout',
        examId,
        exam,
        answer,
        examSections,
        deletedExamMess,
        currentPageView,
        processChecked
      });
    } catch (err) {
      next(err);
    }
  };

  public sendEmail = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    try {
      const exam = await examRepo.findById(req.body.examId);
      const answer = await answerRepo.findById(req.body.answerId);
      // start OrderSpecChange #80169
      if (
        answer?.accessToken === null ||
        (answer?.expiredAt === null && exam?.resultValidity !== null)
      ) {
        const completedAtToString = answer?.completedAt
          ? moment(answer?.completedAt).format('YYYYMMDDHHmmss')
          : '';
        let newAccessToken = answer?.accessToken;
        if (newAccessToken === null) {
          let stringHash = exam?.accessKey + completedAtToString + answer?.id;
          for (let i = 1; i <= 6; i++) {
            stringHash = this.hashSha256(stringHash);
          }
          newAccessToken = stringHash;
        }
        const dataUpdateAnswer = {
          accessToken: newAccessToken,
          expiredAt:
            answer?.expiredAt === null && exam?.resultValidity !== null
              ? moment(answer?.completedAt)
                  .add(exam?.resultValidity, 'm')
                  .toDate()
              : answer?.expiredAt
        };
        // update answer
        await answerRepo.saveAnswer(answer?.id, 'update', dataUpdateAnswer);
      }
      // end OrderSpecChange #80169
      const data = {
        id: answer!.id,
        totalScore: answer!.totalScore,
        passExam: answer!.passExam,
        expiredAt: answer!.expiredAt,
        email: answer!.email,
        name: answer!.name,
        accessToken: answer?.accessToken,
        country: answer!.country,
        scorePercentage: answer!.scorePercentage,
        exam: {
          showResult: exam?.showResult,
          title: exam?.title,
          totalPoints: exam?.totalPoints
        }
      };
      await sendByEmail(<any>data, req);
      res.status(OK).send();
    } catch (err) {
      res.status(BAD_REQUEST).send();
    }
  };
}

/**
 * process answer checked
 */
const processChecked = (
  answerDetail: { examQuestionOptionId: string },
  examQuestionOptionId: number
) => {
  try {
    const checked =
      `${(answerDetail || {}).examQuestionOptionId}`
        .split(',')
        .indexOf(`${examQuestionOptionId}`) >= 0;
    return checked === false ? false : 'checked';
  } catch {
    return false;
  }
};

export default new AnswerController();
