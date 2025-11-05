import { Router } from "express";
import {
    getAllDrops,
    getDropById,
    createDrop,
    updateDrop,
    deleteDrop,
} from "../controllers/admin/drop.controller";


const router = Router();

router.get("/", getAllDrops);
router.get("/:id", getDropById);
router.post("/", createDrop);
router.put("/:id", updateDrop);
router.delete("/:id", deleteDrop);

export default router;