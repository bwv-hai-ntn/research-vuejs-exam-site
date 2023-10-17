/**
 * Main controller
 */
import { NextFunction, Request, Response } from 'express';
// import { messages } from '../constant';
import { BAD_REQUEST, OK } from 'http-status';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { repository } from '../domain';
import sequelize from '../sequelize';
import { Static } from './../constant';
import { clearCookies, clearSession } from './EndTestController';

const examSectionRepo = new repository.ExamSection(sequelize);
const examRepo = new repository.Exam(sequelize);
const examQuestionRepo = new repository.ExamQuestion(sequelize);
const answerDetailRepo = new repository.AnswerDetail(sequelize);

/**
 * Testing Screen
 */
export const testing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get answer form session
    const answer = req.session!.answer;
    if (answer) {
      // get exam
      const exam = await examRepo.findById(answer.examId);
      if (exam!.accessKey !== req.params.accessKey) {
        clearSession(req);
        clearCookies(res);
        res.redirect(`/startTest/${req.params.accessKey}`);
      }
      // get all examSection
      const examSections = await examSectionRepo.getByExamId(answer.examId);
      let currentPage = req.cookies.currentPage || 0;
      // get examQuestions
      let i = 0;
      let timeLeftExam: any = false;
      let timeFlag = false;
      for (const examSection of examSections) {
        // OrderTask #77680 Section毎に制限時間を設定できるようにする
        if (
          req.session!.lastExamSectionId &&
          examSection.id === req.session!.lastExamSectionId
        ) {
          timeFlag = true;
          currentPage = i; // exam.testTimeSetting != 2 => displayed lastExamSectionId on screen
          // exam.testTimeSetting = 2
          if (
            exam?.testTimeSetting ===
            Static.testTimeSetting['Set based on section']
          ) {
            timeLeftExam = timeLeft(
              exam,
              examSection,
              answer,
              req.session!.lastUpdatedAt,
              req.session!.firstCreatedAt,
              req,
              res
            );
            if (!timeLeftExam) {
              if (i < examSections.length - 1) {
                i++;
                currentPage = i;
                timeFlag = false;
                delete req.session!.lastExamSectionId;
                delete req.session!.lastUpdatedAt;
                delete req.session!.firstCreatedAt;
                continue;
              }
              // last section time out
              timeLeftExam = '00:00:00';
            }
          } else {
            timeLeftExam = timeLeft(
              exam,
              examSection,
              answer,
              null,
              null,
              req,
              res
            );
          }
          delete req.session!.lastExamSectionId;
          delete req.session!.lastUpdatedAt;
          delete req.session!.firstCreatedAt;
        }
        if (i === Number(currentPage)) {
          // calculator timeLeft
          if (!timeFlag) {
            timeLeftExam = timeLeft(
              exam,
              examSection,
              answer,
              null,
              null,
              req,
              res
            );
          }
          examSection.examQuestions = await examQuestionRepo.getByExamSectionId(
            examSection.id,
            answer.id,
            exam!.shuffleQuestion,
            exam!.shuffleOption
          );
        }
        i++;
      }

      res.render('exam/testing', {
        currentPage,
        examSections,
        exam,
        answer,
        timeLeft: timeLeftExam,
        processChecked
      });
    } else {
      res.redirect(`/startTest/${req.params.accessKey}`);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * process Time-left
 */
const timeLeft = (
  exam: any,
  examSection: any,
  answer: any,
  lastUpdatedAt: any,
  firstCreatedAt: any,
  req: Request,
  res: Response
) => {
  let time: boolean | number = false;
  // testTimeSetting = 1
  if (exam.testTimeSetting === Static.testTimeSetting['Set based on test']) {
    // time did the test
    const updatedAt: any = moment(answer.updatedAt);
    const createdAt: any = moment(answer.createdAt);
    const timeDid = (updatedAt - createdAt) / 1000;
    const testTime = exam.testTime ? exam.testTime : 0;

    time = testTime * 60 - timeDid;
    if (req.cookies && req.cookies.timeLeft) {
      return req.cookies.timeLeft;
    } else if (time <= 0) {
      return '00:00:00';
    } else {
      const date = new Date(0);
      date.setSeconds(time); // specify value for SECONDS here
      const timeString = date.toISOString().substr(11, 8);
      res.cookie('timeLeft', timeString);
      return timeString;
    }
  }
  // testTimeSetting = 2
  if (exam.testTimeSetting === Static.testTimeSetting['Set based on section']) {
    const testTime = examSection.testTime ? examSection.testTime : 0;
    time = testTime * 60;
    if (lastUpdatedAt) {
      // time did the test
      const updatedAt: any = moment(lastUpdatedAt);
      const createdAt: any = moment(firstCreatedAt);
      const timeDid = (updatedAt - createdAt) / 1000;

      time = time - timeDid;
    }
    if (req.cookies && req.cookies.timeLeft && !req.cookies.nextFlag) {
      return req.cookies.timeLeft;
    } else if (time <= 0) {
      return false;
    } else {
      res.clearCookie('nextFlag');
      const date = new Date(0);
      date.setSeconds(time); // specify value for SECONDS here
      const timeString = date.toISOString().substr(11, 8);
      res.cookie('timeLeft', timeString);
      return timeString;
    }
  }

  return false;
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

/**
 * save answer to DB
 */
export const saveAnswer = async (req: Request, res: Response) => {
  // get answer form session
  const answer = req.session!.answer;
  if (answer) {
    const params = req.body;
    // save answer
    try {
      await answerDetailRepo.saveAnswerData(params, answer);
      // when submit
      res.status(OK).json('OK');
    } catch (error) {
      res.status(BAD_REQUEST).json(error);
    }
  } else {
    res.status(BAD_REQUEST).json('error');
  }
};
