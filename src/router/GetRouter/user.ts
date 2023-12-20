import express from "express";
import {getAllUsers, getUserByEmail, getUserById} from "../../Controllers/User/Get/user";

const useRouter = express.Router();

useRouter.route("/allUsers").get(getAllUsers);
useRouter.route('/userById').get(getUserById);
useRouter.route('/userByEmail').get(getUserByEmail);


module.exports = useRouter;