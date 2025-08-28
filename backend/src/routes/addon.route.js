import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createAddon, deleteAddon, editAddon, getAllAddons, getAnAddon, updateAvailability } from "../controllers/addon.controller.js";

const addonRouter = Router();

addonRouter.post('/create', verifyAdmin, createAddon);
addonRouter.put('/edit/:addonId', verifyAdmin, editAddon);
addonRouter.get('/single/:addonId', getAnAddon);
addonRouter.get('/all', getAllAddons);
addonRouter.delete('/delete/:addonId', verifyAdmin, deleteAddon);
addonRouter.patch('/availability/:addonId', verifyAdmin, updateAvailability);

export default addonRouter;