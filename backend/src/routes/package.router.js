import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createPackage, deletePackage, editPackage, getAllPackages, getAPackage, updateAvailability } from "../controllers/package.controller.js";

const packageRouter = Router();

packageRouter.post('/create', verifyAdmin, createPackage);
packageRouter.put('/edit/:packageId', verifyAdmin, editPackage);
packageRouter.get('/single/:packageId', getAPackage);
packageRouter.get('/all', getAllPackages);
packageRouter.delete('/delete/:packageId', verifyAdmin, deletePackage);
packageRouter.patch('/availability/:packageId', verifyAdmin, updateAvailability);

export default packageRouter;