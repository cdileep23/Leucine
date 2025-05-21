import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { asyncHandler } from "../types/aynchandler";
const router = Router();

router.route("/sign-in").post(UserController.signup);
router.route("/login").post(UserController.login);
router
  .route("/logout")
  .get(UserController.AuthMiddleware, UserController.logout);
router
  .route("/user")
  .get(
    UserController.AuthMiddleware,
    asyncHandler(UserController.getUserProfile)
  );

export default router;
