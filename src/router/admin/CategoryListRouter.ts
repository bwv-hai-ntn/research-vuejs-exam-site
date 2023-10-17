/**
 * Exam Router
 */
import { Router } from 'express';
import CategoryController from '../../controllers/admin/CategoryController';
import viewHelper from '../../middlewares/viewHelper';

const catagoryRouter = Router();

catagoryRouter.use(viewHelper);

catagoryRouter.get('/category', CategoryController.categoryList);

catagoryRouter.post(
  '/category/saveDataCatagory',
  CategoryController.saveDataCatagory
);

catagoryRouter.get(
  '/category/getCategoryByName',
  CategoryController.getCategoryByName
);

catagoryRouter.post(
  '/category/deleteCategory',
  CategoryController.deleteCategory
);

export default catagoryRouter;
