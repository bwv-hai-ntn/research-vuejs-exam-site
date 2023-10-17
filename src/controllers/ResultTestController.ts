/**
 * ResultDetail controller
 */
import { NextFunction, Request, Response } from 'express';
import * as moment from 'moment-timezone';
import { messages } from '../constant';
import { repository } from '../domain';
import sequelize from '../sequelize';

const examRepo = new repository.Exam(sequelize);
const answerRepo = new repository.Answer(sequelize);
const examSectionRepo = new repository.ExamSection(sequelize);
const examQuestionRepo = new repository.ExamQuestion(sequelize);

/**
 * ResultDetail Screen
 */
export const resultDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // step 1: Get answerId
    let accessErrorCountDetail = req.cookies.accessErrorCountDetail
      ? Number(req.cookies.accessErrorCountDetail)
      : 0;
    // accessErrorCount saved in  cookie >= 3
    if (accessErrorCountDetail >= 3) {
      throw { message: messages.tryAgainLater };
    }
    // get answer
    const { accessToken, answerId } = req.params;
    const answers = await answerRepo.findByAccessToken(accessToken, answerId);
    if (answers.length === 0 || answers.length > 1) {
      // set cookie error
      accessErrorCountDetail = accessErrorCountDetail + 1;
      let option: any = {
        httpOnly: true
      };
      if (accessErrorCountDetail >= 3) {
        option = {
          ...option,
          maxAge: 600000
        };
      }
      res.cookie('accessErrorCountDetail', accessErrorCountDetail, option);
      throw { message: messages.notExistAnswer };
    }
    const answer = answers[0];
    // step 2
    // get result exam
    const exam = await examRepo.findById(answer.examId);
    if (!exam) {
      throw { message: messages.notExistExam };
    }
    // step 3
    const systemTime = moment(Date.now());
    if (answer.expiredAt && moment(answer.expiredAt) <= systemTime) {
      throw { message: messages.expiredAnswer };
    }
    // get all examSections
    const examSections = await examSectionRepo.getByExamId(exam!.id);
    // get all examQuestions
    for (const examSection of examSections) {
      examSection.examQuestions = await examQuestionRepo.getByExamSectionId(
        examSection.id,
        answer?.id
      );
    }
    const showResultFlag = exam.showResult;
    res.render('exam/resultDetail', {
      answer,
      exam,
      examSections,
      showResultFlag,
      processChecked
    });
  } catch (err) {
    next(err);
  }
};

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
