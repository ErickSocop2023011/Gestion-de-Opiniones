import { Router } from "express"
import { register, login} from "./auth.controller.js"
import { loginValidator, registerValidator } from "../middlewares/user-validator.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"

const router = Router()

router.post("/register",uploadProfilePicture.single("profilePicture"),registerValidator,register,deleteFileOnError)

router.post("/login",loginValidator, login)

export default router