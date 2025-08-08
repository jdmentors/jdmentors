import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createService, deleteService, editService, getAllServices, getAService, updateAvailability } from "../controllers/service.controller.js";

const serviceRouter = Router();

serviceRouter.post('/create', verifyAdmin, createService);
serviceRouter.put('/edit/:serviceId', verifyAdmin, editService);
serviceRouter.get('/single/:serviceId', getAService);
serviceRouter.get('/all', getAllServices);
serviceRouter.delete('/delete/:serviceId', verifyAdmin, deleteService);
serviceRouter.patch('/availability/:serviceId', verifyAdmin, updateAvailability);

export default serviceRouter;