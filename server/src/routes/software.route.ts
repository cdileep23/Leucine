import Router from "express"
import { softwareEntity } from "../entities/software.entity"
import { SoftwareController } from "../controllers/software.controller"
import { UserController } from "../controllers/user.controller"
import { asyncHandler } from "../types/aynchandler"

const router=Router()
router.route('/create-software').post( UserController.AuthMiddleware,asyncHandler( SoftwareController.createSoftware))


export default router