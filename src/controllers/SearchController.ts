/**
 * Search controller
 */
import { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status';
import * as _ from 'lodash';
import { repository } from '../domain';
import sequelize from '../sequelize';
import * as factory from '../constant/types';
import BaseController from './admin/_baseController';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { plainToClass } from 'class-transformer';
import { TransformerParamsSearchAPI } from '../middlewares/controllerGuard';
import { validateProductBeforeSave } from '../validators/ProductImport';

const productsRepo = new repository.Products(sequelize);

class SearchController extends BaseController {
  public getSearch = async (req: Request, res: Response) => {
    try {
      const params = plainToClass(TransformerParamsSearchAPI, req.query.data);

      let query: any = req.query.data;
      const page = Number(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      query = {
        ...params,
        limit,
        offset
      };

      const products = await productsRepo.searchProducts(<
        factory.products.searchListProducts
      >{
        ...query
      });

      if (_.isEmpty(req.query)) {
        return res.render('search/index', {
          layout: 'layout/userLayout',
          products: products
        });
      } else {
        return res.json(products);
      }
    } catch (err) {
      console.log(err);
      return res.status(BAD_REQUEST).json({ status: 'fail' });
    }
  };

  public delete = async (req: Request, res: Response) => {
    const result = await productsRepo.deleteProduct(req.body.id);
    res.json(result);
  };

  public import = async (req: Request, res: Response) => {
    const csvFilePath = req.file?.path;

    const fileContent = await fs.readFileSync(csvFilePath!, {
      encoding: 'utf-8'
    });
    fs.unlinkSync(csvFilePath!);

    const header = ['id', 'name', 'price', 'content', 'featured_flg'];

    const data = await parse(fileContent, {
      delimiter: ',',
      columns: header
    });

    const validators = await validateProductBeforeSave(data);

    if(validators.data.length > 0) {
      await productsRepo.saveProduct(validators.data);
    }

    if (validators.errorMessages.length > 0) {
      res.json({ message: validators.errorMessages });
    } else {
      res.json({ status: 'ok' });
    }
  };
}

export default new SearchController();
