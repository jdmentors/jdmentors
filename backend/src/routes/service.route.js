import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createService, deleteService, getAllServices, getAService } from "../controllers/service.controller.js";

const serviceRouter = Router();

serviceRouter.post('/create', verifyAdmin, createService);
serviceRouter.get('/single/:slug', getAService);
serviceRouter.get('/all', getAllServices);
serviceRouter.delete('/delete/:serviceId', verifyAdmin, deleteService);

export default serviceRouter;