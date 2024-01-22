import { UserModel } from "../models/user.model.js";

export const UserService = {
  signup: async (body) => {
    const newUser = await UserModel.create(body);
    return newUser;
  },


  emailExist: async (email) => {
    const newUser = await UserModel.findOne({email});
    return newUser !== null;
  },

  emailCheck: async (email ) => {
   return  UserModel.findOne({email})
  }

};



