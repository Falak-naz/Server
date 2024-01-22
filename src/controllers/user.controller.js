import { UserModel } from "../models/user.model.js";
import { UserService } from "../services/index.js";
import { httpResponse } from "../utils/index.js";
import  passwordHash from "password-hash";

export const UserController = {

  signup: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      console.log(name, email, password);
      const userExist = await UserService.emailExist(email); 

      if (userExist) {
        return httpResponse.CONFLICT(res, { error: "Email already exists" }); 
      }

       
      const hashpassword =  passwordHash.generate(password);
      
      const data = await UserService.signup({ name, email, password:hashpassword});
      if (data) {
        return httpResponse.SUCCESS(res, data);
      }
    } catch (error) {
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },

  signin: async (req, res) => {
    try {
      const {email} = req.body;
        const data = await UserService.emailCheck(email); // check email id is already available or not
        if(data){
          return httpResponse.SUCCESS(res, data);
        }
    } catch (error) {
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },
};
