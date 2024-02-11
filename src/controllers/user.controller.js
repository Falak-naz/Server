import { UserModel } from "../models/user.model.js";
import { UserService } from "../services/index.js";
import { httpResponse } from "../utils/index.js";
import passwordHash from "password-hash";
import jwt from "jsonwebtoken";

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

     await UserModel.findByIdAndUpdate(data._id, { token: token });
         const  finalobj= {
          username : data.name,
          email : data.email,
          token : data.token
        }
     return httpResponse.SUCCESS(res, finalobj );
         
    } catch (error) {
      console.error("Error updating user token:", error); // Log the error
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },
  
  updateUser: async (req, res) => {
    const { name, email, oldPassword, newPassword, phone, bio, birthDate } = req.body;
    const userId = req.params.id;

    try {
      // Retrieve the user from the database
      const user = await UserModel.findById(userId);

      if (!user) {
        return httpResponse.NOT_FOUND(res, { error: "User not found" });
      }

      // Check if old password is correct
      const isPasswordCorrect = passwordHash.verify(oldPassword, user.password);

      if (!isPasswordCorrect) {
        return httpResponse.UNAUTHORIZED(res, { error: "Wrong old password" });
      }

      // If old password is correct, hash the new password
      const hashpassword = passwordHash.generate(newPassword);

      // Update user with new details
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { name, email, password: hashpassword, phone, bio, birthDate },
        { new: true }
      );

      return httpResponse.SUCCESS(res, { message: "Updated password successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },

};

