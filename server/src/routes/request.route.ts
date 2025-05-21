import Router from "express"
import { UserController } from "../controllers/user.controller"
import { asyncHandler } from "../types/aynchandler"
import { RequestController } from "../controllers/request.controller"

const router=Router()

router
  .route("/get-all")
  .get(
    UserController.AuthMiddleware,
    asyncHandler(RequestController.getAllRequest)
  );
router
  .route("/")
  .post(
    UserController.AuthMiddleware,
    asyncHandler(RequestController.postRequestAccess)
  )
  router
    .route("/:id")
    .patch(
      UserController.AuthMiddleware,
      asyncHandler(RequestController.UpdateRequest)
    );
  
 
export default router