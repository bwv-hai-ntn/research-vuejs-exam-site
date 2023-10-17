/**
 * Information controller
 */
import { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status';
import { isEqual } from 'lodash';
import { Static } from '../constant';
import { repository } from '../domain';
import sequelize from '../sequelize';

const informationRepo = new repository.Information(sequelize);

export const getInformation = async (req: Request, res: Response) => {
  try {
    const informations = await informationRepo.searchInformation({
      limit: Static.listLimit.LimitInformationList
    });

    let headerOpen = true;
    if (informations.length >= 1 && informations[0].mandatory) {
      if (
        req.cookies &&
        req.cookies.headerInformationId &&
        isEqual(req.cookies.headerInformationId, informations[0].id.toString())
      ) {
        headerOpen = false;
      } else {
        res.cookie('headerInformationId', informations[0].id);
      }
    } else {
      headerOpen = false;
    }

    return res.json({ data: informations, headerOpen });
  } catch (err) {
    return res.status(BAD_REQUEST).json({ status: 'fail' });
  }
};
