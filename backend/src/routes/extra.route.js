import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createExtra, deleteExtra, editExtra, getAllExtras, getAnExtra, updateAvailability } from "../controllers/extra.controller.js";

const extraRouter = Router();

extraRouter.post('/create', verifyAdmin, createExtra);
extraRouter.put('/edit/:extraId', verifyAdmin, editExtra);
extraRouter.get('/single/:extraId', getAnExtra);
extraRouter.get('/all', getAllExtras);
extraRouter.delete('/delete/:extraId', verifyAdmin, deleteExtra);
extraRouter.patch('/availability/:extraId', verifyAdmin, updateAvailability);

export default extraRouter;