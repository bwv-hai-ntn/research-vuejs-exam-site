/**
 * Exam controller
 */
import { NextFunction, Request, Response } from 'express';
import { repository } from '../../domain';
import sequelize from '../../sequelize';
import BaseController from './_baseController';

const categoryRepo = new repository.Category(sequelize);

class CategoryController extends BaseController {
  public categoryList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const headerData = this.getHeaderData(req);
      const categoryList = await categoryRepo.getCategory(
        req.session!.admin.id,
        req.session!.admin.userFlag
      );
      res.render('admin/categoryList', {
        layout: 'layout/adminLayout',
        headerData,
        categoryList
      });
    } catch (err) {
      next(err);
    }
  };

  public saveDataCatagory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await categoryRepo.saveDataCatagory(
        req.body.categoryId,
        req.body.categoryName
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  public getCategoryByName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const categoryName: any = req.query.categoryName;
      const categoryList = await categoryRepo.getCategory(
        req.session!.admin.id,
        req.session!.admin.userFlag,
        categoryName
      );
      res.json(categoryList);
    } catch (err) {
      next(err);
    }
  };

  public deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await categoryRepo.deleteCategory(req.body.categoryId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

export default new CategoryController();
