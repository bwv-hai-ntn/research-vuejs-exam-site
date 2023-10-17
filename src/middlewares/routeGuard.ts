// import { NextFunction, Request, Response } from 'express';
import { Static } from './../constant';
// import { FORBIDDEN } from 'http-status';

const userFlag = Static.authority;

export const screenList = {
  userList: 'userList',
  categoryList: 'categoryList',
  examList: 'examList',
  examCreateEdit: 'examCreateEdit',
  questionCreateEdit: 'questionCreateEdit',
  answerList: 'answerList',
  answerView: 'answerView'
};

export const permissions = {
  [screenList.userList]: [userFlag.ADMIN],
  [screenList.categoryList]: [userFlag.ADMIN],
  [screenList.examList]: [userFlag.ADMIN],
  [screenList.examCreateEdit]: [userFlag.ADMIN],
  [screenList.questionCreateEdit]: [userFlag.ADMIN],
  [screenList.answerList]: [userFlag.ADMIN],
  [screenList.answerView]: [userFlag.ADMIN]
};

/**
 * prevent user enter screen without authorization
 * @param screenName name of screen, define in `screenList`
 */
// export const routeGuard = (screenName: string, webview?: boolean) => {
//   const screenPermission = permissions[screenName];
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (screenPermission.indexOf(req.session!.admin!.userFlag!) >= 0) {
//       next();
//     } else {
//       if (res.getHeader('Content-Type') === 'application/json') {
//         res.status(FORBIDDEN).json({
//           message: 'アクセスしようとした画面の権限がありません'
//         });
//       } else {
//         if (webview) {
//           res.status(FORBIDDEN).render('errors/error', {
//             layout: 'layout/preLogin',
//             title: messages.authError,
//             error: validationMessages['ECL-33']
//           });
//         } else {
//           res.status(FORBIDDEN).render('errors/error', {
//             title: messages.authError,
//             error: validationMessages['ECL-33']
//           });
//         }
//       }
//     }
//   };
// };
