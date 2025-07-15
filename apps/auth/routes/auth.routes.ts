import { Router } from "express";
import { registerController } from "../controllers/register.controller";
import { loginController } from "../controllers/login.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { meController } from "../controllers/me.controller";
import { logoutController } from "../controllers/logout.controller";
import { refreshController } from "../controllers/refresh.controller";
import { isAdmin } from "../middleware/isAdmin.middleware";
import { getAllUserController } from "../controllers/getAllUser.controller";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, meController);
router.post("/logout", logoutController);
router.post("/refreshToken", refreshController);
router.get("/getAllUsers", authMiddleware, isAdmin, getAllUserController)

export default router;
