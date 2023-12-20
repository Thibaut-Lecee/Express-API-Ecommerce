import express from "express";
import {getAllUsers} from "../../Controllers/User/Get/user";

const useRouter = express.Router();

useRouter.route("/allUsers").get(getAllUsers);


module.exports = useRouter;