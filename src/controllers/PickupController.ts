/**
 * Pickup controller
 */
import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status';
import { find, uniq } from 'lodash';
import { Static } from '../constant';
import { repository } from '../domain';
import sequelize from '../sequelize';

const pickupRepo = new repository.Pickup(sequelize);
const examRepo = new repository.Exam(sequelize);

export const getPickupById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.pickupId) {
      return res.redirect('/');
    }

    const pickup = await pickupRepo.searchPickupId(req.params.pickupId);

    if (!pickup) {
      return res.redirect('/');
    }

    return res.render('pickup/index', {
      pickup,
      layout: 'layout/userLayout'
    });
  } catch (err) {
    next(err);
  }
};

export const getPickup = async (_: Request, res: Response) => {
  try {
    const pickups = await pickupRepo.searchPickup({
      limit: Static.listLimit.LimitPickupList,
      limitDetail: Static.listLimit.LimitPickupDetailList
    });

    let examIdList: number[] = [];
    pickups.forEach((pickup) => {
      examIdList = examIdList.concat(pickup.pickupDetail!.map((x) => x.examId));
    });

    const exams = await examRepo.searchListExamById(uniq(examIdList));

    pickups.forEach((pickup) => {
      pickup.pickupDetail!.forEach((pickupDetail) => {
        pickupDetail.setDataValue(
          'exam',
          find(exams, { id: pickupDetail.examId })
        );
      });
    });

    return res.json({ data: pickups });
  } catch (err) {
    return res.status(BAD_REQUEST).json({ status: 'fail' });
  }
};
