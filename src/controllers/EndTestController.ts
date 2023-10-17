/**
 * EndTest controller
 */
import { NextFunction, Request, Response } from 'express';
import { truncate } from '../utils/common';

/**
 * EndTest Screen
 */
export const endTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const answer = req.session!.answer;
    if (req.session && req.session.endTest && answer) {
      // get result answer
      const result = req.session!.resultAnswer;

      const resultDetail = {
        examId: result.exam.id,
        showResult: result.exam.showResult,
        answerId: answer.id
      };
      clearSession(req);
      clearCookies(res);

      // create new session for ResultDetail Screen
      (<Express.Session>req.session).resultDetail = resultDetail;

      res.render('exam/endTest', {
        result,
        answerId: answer.id,
        truncate
      });
    } else {
      res.redirect(`/startTest/${req.params.accessKey}`);
    }
  } catch (err) {
    next(err);
  }
};

export const clearSession = (req: Request) => {
  const arrSessionToDel = [
    'user',
    'answer',
    'endTest',
    'resultAnswer',
    'bodyName'
  ];

  // clear all session and cookies
  for (const sessionName of arrSessionToDel) {
    delete req.session![sessionName];
  }
  req.user = undefined;
};

export const clearCookies = (res: Response) => {
  // remove cookies
  res.clearCookie('timeLeft');
  res.clearCookie('currentPage');
  res.clearCookie('accessErrorCount');
};
