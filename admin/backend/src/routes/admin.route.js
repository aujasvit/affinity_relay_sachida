import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    addMerchant,
    deleteMerchant,
    deleteRequest,
    getMerchants,
    getPendingMerchants,
    getRelay,
    setupRelay,
    updateMerchant,
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/addMerchant").post(upload.array(), addMerchant);
router.route("/deleteMerchant").post(upload.array(), deleteMerchant);
router.route("/updateMerchant").post(upload.array(), updateMerchant);

router.route("/getMerchants").get(getMerchants);

router.route("/getPendingMerchants").get(getPendingMerchants);
router.route("/deleteRequest").post(upload.array(), deleteRequest);
router.route("/setupRelay").post(upload.array(), setupRelay);
router.route("/getRelay").get(getRelay);


export default router;
