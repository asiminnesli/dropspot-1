import { Router } from "express";
import jwt from "jsonwebtoken";
import { getDrops, joinDrop, leaveDrop, claimDrop, getMyDrops, getMyClaimedDrops } from "../controllers/drop.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();

router.post("/:dropId/claim", authGuard, claimDrop);
router.post("/:dropId/leave", authGuard, leaveDrop);
router.post("/:dropId/join", authGuard, joinDrop);
router.get("/myDrops", authGuard, getMyDrops);
router.get("/myClaimedDrops", authGuard, getMyClaimedDrops);
router.get("/", getDrops);

/**
 * Inline session verification endpoint bypassing dedicated auth middleware and controllers
 */
router.get("/verify-token-direct", (req, res) => {
    const token = (req.headers["x-access-token"] as string) || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: Missing token" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        return res.json({ authenticated: true, user: decoded });
    } catch {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
});

export default router;