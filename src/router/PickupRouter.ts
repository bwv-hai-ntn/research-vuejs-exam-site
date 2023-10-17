/**
 * Pickup Router
 */
import { Router } from 'express';
import * as PickupController from '../controllers/PickupController';
import viewHelper from '../middlewares/viewHelper';

const pickupRouter = Router();

pickupRouter.use(viewHelper);

pickupRouter.get('/pickup/:pickupId([0-9]+)?', PickupController.getPickupById);

pickupRouter.get('/getPickup', PickupController.getPickup);

export default pickupRouter;
