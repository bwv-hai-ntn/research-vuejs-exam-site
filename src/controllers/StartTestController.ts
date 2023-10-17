/**
 * Main controller
 */
import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, OK } from 'http-status';
import * as _ from 'lodash';
import { messages, Static } from '../constant';
import { repository } from '../domain';
import sequelize from '../sequelize';
import { sendByEmail } from '../utils/sendEmail';
import { clearCookies } from './EndTestController';

const examRepo = new repository.Exam(sequelize);
const answerRepo = new repository.Answer(sequelize);
const answerDetailRepo = new repository.AnswerDetail(sequelize);

/**
 * startTest Screen
 */
export const startTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    saveCheckReferer(req);

    let accessErrorCount = req.cookies.accessErrorCount
      ? Number(req.cookies.accessErrorCount)
      : 0;
    // error tryAgainLater
    if (accessErrorCount >= 3) {
      throw { message: messages.tryAgainLater };
    }
    // get exam
    const exams = await examRepo.searchExam(req.params.accessKey);
    // check exam
    // step 0
    if (exams.length === 0 || exams.length > 1) {
      // set cookie error
      accessErrorCount = accessErrorCount + 1;
      let option: any = {
        httpOnly: true
      };
      if (accessErrorCount >= 3) {
        option = {
          ...option,
          maxAge: 600000
        };
      }
      res.cookie('accessErrorCount', accessErrorCount, option);
      // error notExistExam
      throw { message: messages.notExistExam };
    }

    const exam = exams[0];
    let errMessage = '';
    let renderFlag = true;

    // step 1
    let view = 'exam/startTest';
    if (exam.acceptAnswer !== 1) {
      view = 'exam/errorForm';
      errMessage = messages.closedForm;
    } else {
      // step 2, 3
      renderFlag = checkLogin(
        { signinRestrict: exam.signinRestrict },
        req,
        res
      );

      // check step 4,5,6,7
      if (exam.signinRestrict === 1) {
        // delete bodyName in session
        (<Express.Session>req.session).bodyName = undefined;
        // step 4
        if (checkUserRestrict({ userRestrict: exam.userRestrict }, req)) {
          view = 'exam/errorForm';
          errMessage = messages.formRestricted;
        } else {
          // step 5
          if (exam.limitResponse === 1) {
            // step 6
            if (await checkAlreadyResponded(exam.id, req)) {
              view = 'exam/errorForm';
              errMessage = messages.alreadyResponded;
            } else {
              // step 7
              if (await checkContinueTest(exam.id, req)) {
                view = 'exam/continueTest';
                errMessage = messages.continueTest;
              }
            }
          } else {
            // step 7
            if (await checkContinueTest(exam.id, req)) {
              view = 'exam/continueTest';
              errMessage = messages.continueTest;
            }
          }
        }
      }
    }

    // continue test
    if (req.params.action === 'continue') {
      const bodyName = req.session!.bodyName;
      const email = req.user ? (<any>req.user).email : undefined;
      const answer = await answerRepo.searchAnswerAndDelete(
        exam.id,
        bodyName,
        email
      );
      const detailData = await answerDetailRepo.searchByAnswerId(answer.id);
      // save answer to session
      (<Express.Session>req.session).answer = answer;
      // save lastExamSectionId to session
      if (detailData) {
        (<Express.Session>req.session).lastExamSectionId =
          detailData.examSectionId;
        (<Express.Session>req.session).lastUpdatedAt = detailData.lastUpdatedAt;
        (<Express.Session>req.session).firstCreatedAt =
          detailData.firstCreatedAt;
      }
      res.redirect(`/testing/${req.params.accessKey}`);
      renderFlag = false;

      // start new testing
    } else if (req.params.action === 'new-test') {
      const bodyName = req.session!.bodyName;
      const email = req.user ? (<any>req.user).email : undefined;
      const answer = await answerRepo.deleteAndCreate(
        exam.id,
        bodyName,
        email,
        req.user
      );
      // save answer to session
      (<Express.Session>req.session).answer = answer;
      res.redirect(`/testing/${req.params.accessKey}`);
      renderFlag = false;

      // save
    } else if (req.method === 'POST') {
      const result = await (await startTestProcess(exam))(req, res);
      if (result.error) {
        view = 'exam/continueTest';
        errMessage = messages.continueTest;
        renderFlag = true;
      } else {
        renderFlag = false;
      }
    }

    // process when click submit button or timeleft
    if (req.session && req.session.endTest) {
      if (errMessage.length === 0 || errMessage === messages.continueTest) {
        // save answer
        const result = await answerRepo.endTest(req.session!.answer);
        (<Express.Session>req.session).resultAnswer = result;
        // sendEmail
        if (
          req.session!.answer.sendResultViaEmail ===
          Static.sendResultViaEmail.ON
        ) {
          await sendByEmail(
            {
              ...result,
              id: req.session?.answer.id,
              email: req.session!.answer.email,
              name: req.session.answer.name,
              country: req.session!.answer.country
            },
            req
          );
        }
        res.status(OK).json('OK');
      } else {
        // remove session
        clearCookies(res);
        (<Express.Session>req.session).endTest = undefined;
        // (<Express.Session>req.session).pushState = '/testing/';
        res.status(BAD_REQUEST).json('error');
      }

      renderFlag = false;
    }

    if (renderFlag) {
      clearCookies(res);

      // const pushState = req.session ? req.session.pushState : '';
      // (<Express.Session>req.session).pushState = undefined;

      res.render(view, {
        exam,
        errMessage,
        pushState: ''
      });
    }
  } catch (err) {
    next(err);
  }
};

const checkLogin = (
  exam: { signinRestrict: number | undefined },
  req: Request,
  res: Response
) => {
  if (exam.signinRestrict === 1 && !req.user) {
    // save current url
    (<Express.Session>req.session).redirect = req.originalUrl;
    res.render('login/index', {
      //
    });
    return false;
  }
  return true;
};

const checkUserRestrict = (
  exam: { userRestrict: string | undefined },
  req: Request
) => {
  const user: any = req.user;
  return (
    exam.userRestrict !== null &&
    user &&
    (user.email || '@').split('@')[1] !== exam.userRestrict
  );
};

const checkAlreadyResponded = async (examId: number, req: Request) => {
  let flag = false;
  const user: any = req.user;
  if (user) {
    const answers = await answerRepo.searchAnswer(user.email, examId, true);
    flag = answers.length > 0;
  }

  return flag;
};

const checkContinueTest = async (examId: number, req: Request) => {
  let flag = false;
  const user: any = req.user;
  if (user) {
    const answers = await answerRepo.searchAnswer(user.email, examId, false);
    flag = answers.length > 0;
  }

  return flag;
};

/**
 * Save when click Start button
 */
export const startTestProcess = async (exam: {
  id: number;
  signinRestrict?: number;
}) => async (req: Request, res: Response) => {
  const user: any = req.user;
  let error = false;
  if (exam.signinRestrict !== 1) {
    const answers = await answerRepo.searchAnswerByName(req.body.name, exam.id);
    if (answers.length > 0) {
      // save bodyName to sesstion
      (<Express.Session>req.session).bodyName = req.body.name;
      error = true;
    }
  }

  if (!error) {
    // save
    let params: any = {
      examId: exam.id
    };
    let email = null;
    let sendResultViaEmail = Static.sendResultViaEmail.OFF;
    if (req.body.isActiveSendEmail === 'true') {
      email = req.body.email;
      sendResultViaEmail = Static.sendResultViaEmail.ON;
    }
    const bodyName = req.body.name;
    if (bodyName !== undefined && bodyName !== null) {
      params = {
        ...params,
        name: bodyName,
        email,
        sendResultViaEmail
      };
    } else {
      params = {
        ...params,
        name: user.displayName,
        email: user.email,
        sendResultViaEmail
      };
    }

    const answer = await answerRepo.createAnswer(params);

    // save answer to session
    (<Express.Session>req.session).answer = answer;
    // redirect to Testing screen
    res.redirect(`/testing/${req.params.accessKey}`);
  }

  return { error };
};

/**
 * handler save referer into session when Testing screen redirect to StartTest Screen
 * check step 1->6 when click button submit in the Testing screen
 */
const saveCheckReferer = (req: Request) => {
  if (req.query && req.query.referer) {
    (<Express.Session>req.session).endTest = '/endTest/' + req.params.accessKey;
  }
};
