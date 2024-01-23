import { UserModel } from "../models/user.model.js";
import { UserService } from "../services/index.js";
import { httpResponse } from "../utils/index.js";
import passwordHash from "password-hash";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

export const UserController = {
  signup: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      console.log(name, email, password);
      const userExist = await UserService.emailExist(email);

      if (userExist) {
        return httpResponse.CONFLICT(res, { error: "Email already exists" });
      }

      const hashpassword = passwordHash.generate(password);

      const data = await UserService.signup({
        name,
        email,
        password: hashpassword,
      });
      if (data) {
        return httpResponse.SUCCESS(res, data);
      }
    } catch (error) {
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },

  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const data = await UserService.emailCheck(email); // check email id is already available or not
      if (!data) {
        return httpResponse.NOT_FOUND(res, { error: "user not found" });
      }
      const hashedPassword = passwordHash.verify(password, data.password);

      if (!hashedPassword) {
        return httpResponse.NOT_FOUND(res, { error: "password not matched" });
      }

      const token = jwt.sign({ userId: data._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      if (data) {
        return httpResponse.SUCCESS(res, data, { token: token });
      }
    } catch (error) {
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },
};
