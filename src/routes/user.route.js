import express from "express";
import { UserValidationSchema } from "../validations/index.js";
import { validate, authenticate } from "../middleware/index.js";
import { UserController } from "../controllers/index.js";
import multer from "multer";

const router = express.Router();
// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the destination directory for storing uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Specify the file name for storing uploaded files
    }
  });
  const upload = multer({ storage: storage });

router.post("/signup",validate(UserValidationSchema.add), UserController.signup)
router.post("/signin", UserController.signin)
router.put('/about/:id', upload.single('profilePic'), validate(UserValidationSchema.update), UserController.updateUser);
router.get('/about/:id', UserController.getUser);
router.delete('/:id',  UserController.deleteUser);


export default router;
