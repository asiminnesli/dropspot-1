import { Router } from "express";
import { getDrops, joinDrop, leaveDrop, claimDrop, getMyDrops, getMyClaimedDrops } from "../controllers/drop.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();

router.post("/:dropId/claim", authGuard, claimDrop);
router.post("/:dropId/leave", authGuard, leaveDrop);
router.post("/:dropId/join", authGuard, joinDrop);
router.get("/myDrops", authGuard, getMyDrops);
router.get("/myClaimedDrops", authGuard, getMyClaimedDrops);
router.get("/", getDrops);



export default router;