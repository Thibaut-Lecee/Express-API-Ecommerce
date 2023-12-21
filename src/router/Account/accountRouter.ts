import {Router} from "express";

const accountRouter = Router();

import {signIn, createUser} from "../../Controllers/User/Post/user";
import {validateCreateUser} from "../../Middlewares/handleData";

accountRouter.route("/signUp").post(validateCreateUser, createUser);
accountRouter.route("/signIn").post(signIn);


module.exports = accountRouter;