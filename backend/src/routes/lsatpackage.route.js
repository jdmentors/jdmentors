import { Router } from "express";
import { 
    getAllPackages,
    createPackagePurchase, 
    getUserPackages, 
    usePackageSession, 
    getPackagePurchase,
    createLSATPackage,
    getActiveLSATPackages,
    updateLSATPackage,
    deleteLSATPackage,
    updateLSATPackageAvailability,
    getLSATPackage
} from "../controllers/lsatpackage.controller.js";
import verifyUser from "../middlewares/verifyUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const lsatPackageRouter = Router();

lsatPackageRouter.get('/all', getAllPackages);
lsatPackageRouter.get('/single/:packageId', getLSATPackage);
lsatPackageRouter.post('/purchase', createPackagePurchase);
lsatPackageRouter.get('/user/:email', getUserPackages);
lsatPackageRouter.patch('/use-session', usePackageSession);
lsatPackageRouter.get('/purchase/:purchaseId', getPackagePurchase);
lsatPackageRouter.post('/create', verifyAdmin, createLSATPackage);
lsatPackageRouter.get('/active', getActiveLSATPackages);
lsatPackageRouter.put('/edit/:packageId', verifyAdmin, updateLSATPackage);
lsatPackageRouter.delete('/delete/:packageId', verifyAdmin, deleteLSATPackage);
lsatPackageRouter.patch('/availability/:packageId', verifyAdmin, updateLSATPackageAvailability);

export default lsatPackageRouter;