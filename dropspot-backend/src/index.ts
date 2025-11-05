import express from "express";
import dotenv from "dotenv";
import { prisma } from "./db";
import { errorHandler } from "./middlewares/errorHandler";
import AuthRoutes from "./routes/auth.route";
import DropRoutes from "./routes/drop.route";
import AdminDropRoutes from "./routes/admin.drop.route";
import { adminMiddleware } from "./middlewares/admin.middleware";
import cors from "cors";
dotenv.config();
const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));

app.use(express.json());
app.use(errorHandler);

// routes
app.use("/auth", AuthRoutes);
app.use("/drops", DropRoutes);
app.use("/admin/drops", adminMiddleware, AdminDropRoutes);


app.get("/", (_, res) => res.send("DropSpot Auth Service 🚀"));

app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));