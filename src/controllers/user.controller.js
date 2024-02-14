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
  
      const user = await UserService.emailCheck(email); // Check if email exists
      if (!user) {
        return httpResponse.NOT_FOUND(res, { error: "user not found" });
      }
      const isPasswordValid = passwordHash.verify(password, user.password);
  
      if (!isPasswordValid) {
        return httpResponse.NOT_FOUND(res, { error: "password not matched" });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Update the token in the database
      await UserModel.findByIdAndUpdate(user._id, { token: token });
  
      // Prepare the response object
      const responseObj = {
        username: user.name,
        email: user.email,
        token: token,
        userId: user._id // Include the user ID in the response
      };
  
      return httpResponse.SUCCESS(res, responseObj);
       
    } catch (error) {
      console.error("Error in sign-in:", error); // Log the error
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },
  
  
  updateUser: async (req, res) => {
    const { name, email, oldPassword, newPassword, phone, bio, birthDate } = req.body;
    const userId = req.params.id;
  
    try {
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return httpResponse.NOT_FOUND(res, { error: "User not found" });
      }
  
      // Object to hold the fields that need to be updated
      const updateFields = {};
  
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (phone) updateFields.phone = phone;
      if (bio) updateFields.bio = bio;
      if (birthDate) updateFields.birthDate = birthDate;
  
      // Check and update password only if oldPassword and newPassword are provided
      if (oldPassword && newPassword) {
        const isPasswordCorrect = passwordHash.verify(oldPassword, user.password);
        if (!isPasswordCorrect) {
          return httpResponse.UNAUTHORIZED(res, { error: "Wrong old password" });
        }
        updateFields.password = passwordHash.generate(newPassword);
      }
  
      // Update user with new details
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updateFields, { new: true });
  
      return httpResponse.SUCCESS(res, { message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },
  
  getUser: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await UserModel.findById(userId).select('-password'); // Exclude the password from the result
      if (!user) {
        return httpResponse.NOT_FOUND(res, { error: "User not found" });
      }
      
      return httpResponse.SUCCESS(res, user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await UserModel.findById(userId);
      
      if (!user) {
        return httpResponse.NOT_FOUND(res, { error: "User not found" });
      }
  
      await UserModel.findByIdAndDelete(userId);
  
      return httpResponse.SUCCESS(res, { message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },


};

