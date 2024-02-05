import express from "express";
import { UserValidationSchema } from "../validations/index.js";
import { validate, authenticate } from "../middleware/index.js";
import { UserController } from "../controllers/index.js";

const router = express.Router();
router.post("/signup",validate(UserValidationSchema.add), UserController.signup)
router.post("/signin", UserController.signin)


export default router;
