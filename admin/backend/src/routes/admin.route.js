import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    addMerchant,
    deleteMerchant,
    deleteRequest,
    getMerchants,
    getPendingMerchants,
    updateMerchant,
} from "../controllers/admin.controller.js";

const router = Router();

const dbname = "admin";

// add new lab
router.route("/addMerchant").post(upload.array(), addMerchant);
router.route("/deleteMerchant").post(upload.array(), deleteMerchant);
router.route("/updateMerchant").post(upload.array(), updateMerchant);

router.route("/getMerchants").get(getMerchants);

router.route("/getPendingMerchants").get(getPendingMerchants);
router.route("/deleteRequest").post(upload.array(), deleteRequest);

// Authentication
// router.route("/login").post(upload.array(), login(dbname));
// router.route("/logout").get(verifyJWT(dbname), logout(dbname));
// router.route("/check-auth").get(verifyJWT(dbname), (req, res) => {
//     return res
//         .status(200)
//         .json(new ApiResponse(200, {}, `${dbname} is authed`));
// });
// router.route("/check-otp-auth").get(verifyOTPJWT(dbname), (req, res) => {
//     return res
//         .status(200)
//         .json(new ApiResponse(200, {}, `${dbname} is authed by otp`));
// });

// register new admin
// router.route("/register").post(
//     upload.fields([
//         {
//             name: "avatar",
//             maxCount: 1,
//         },
//     ]),
//     verifyJWT(dbname),
//     adminRegister
// );

export default router;
