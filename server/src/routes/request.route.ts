import Router from "express"
import { UserController } from "../controllers/user.controller"
import { asyncHandler } from "../types/aynchandler"
import { RequestController } from "../controllers/request.controller"

const router=Router()

router.route('/').post(UserController.AuthMiddleware,asyncHandler(RequestController.postRequestAccess))
export default router