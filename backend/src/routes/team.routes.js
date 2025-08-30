import { Router } from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import upload from "../utils/multer.js";
import { addTeam, deleteTeam, getAllTeam, getATeam, updateTeam } from "../controllers/team.controller.js";

const teamRouter = Router();

teamRouter.post('/add', verifyAdmin, upload.any(), addTeam);
teamRouter.get('/all', getAllTeam);
teamRouter.get('/single/:id', getATeam);
teamRouter.patch('/update/:id', verifyAdmin, upload.any(), updateTeam);
teamRouter.delete('/delete/:id', verifyAdmin, deleteTeam);

export default teamRouter;