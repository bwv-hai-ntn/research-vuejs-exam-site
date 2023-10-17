/**
 * User controller
 */
import { NextFunction, Request, Response } from 'express';
import { FORBIDDEN, OK } from 'http-status';
import { repository } from '../../domain';
import sequelize from '../../sequelize';
import { messages, Static } from './../../constant';
import BaseController from './_baseController';

const userRepo = new repository.User(sequelize);
const categoryRepo = new repository.Category(sequelize);

class UserController extends BaseController {
  /**
   * create/edit question
   */
  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.session!.admin.userFlag !== Static.authority.ADMIN) {
        throw { FORBIDDEN };
      }
      const query: any = req.query;
      // Set default status
      if (query.authority !== undefined) {
        for (let i = 0; i < query.authority.length; i++) {
          if (query.authority[i] === '') {
            query.authority.splice(i, 1);
          }
        }
      }
      const result = await userRepo.searchListUser(query);
      const categories = await categoryRepo.getCategoryUser();
      const categoryModal = await categoryRepo.getCategory(
        req.session!.admin.id,
        req.session!.admin.userFlag
      );
      res.render('admin/user/list', {
        layout: 'layout/adminLayout',
        users: result,
        queryData: query,
        valueList: Static,
        messages,
        categories,
        categoryModal
      });
    } catch (err) {
      next(err);
    }
  };

  public searchUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query: any = req.query;
      // Set default authority
      if (query.authority === undefined) {
        query.authority = [Static.authorityScreen.Author];
      } else {
        for (let i = 0; i < query.authority.length; i++) {
          if (query.authority[i] === '') {
            query.authority.splice(i, 1);
          }
        }
      }
      query.authority =
        query.authority !== '' ? query.authority.split(',') : '';
      const exam = await userRepo.searchListUser(query);
      res.json(exam);
    } catch (error) {
      next(error);
    }
  };

  public createUpdateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const duplicate = await userRepo.checkUser(
        req.body.emailEdit,
        req.body.id
      );
      let message;
      // check email duplicate
      if (!duplicate) {
        message = messages.duplicateError('Email');
      } else {
        await userRepo.createUpdateUser(req.body);
      }
      res.json({ message });
    } catch (err) {
      next(err);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await userRepo.deleteUser(req.params.id);
      res.send(OK);
    } catch (err) {
      next(err);
    }
  };

  public checkUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await userRepo.checkUser(req.body.email, req.body.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  public createUpdateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await userRepo.createUpdateCategory({
        userId: req.body.userId,
        cbxCategory: req.body.cbxCategory
      });
      res.send(OK);
    } catch (err) {
      next(err);
    }
  };
}

export default new UserController();
