import express from "express";
import { UserValidationSchema } from "../validations/index.js";
import { validate, authenticate } from "../middleware/index.js";
import { UserController } from "../controllers/index.js";

const router = express.Router();
router.post("/signup",validate(UserValidationSchema.add), UserController.signup)
router.post("/signin", UserController.signin)
router.put('/about/:id', validate(UserValidationSchema.update), UserController.updateUser);
router.get('/about/:id', UserController.getUser);
router.delete('/:id',  UserController.deleteUser);


export default router;
