import express, {request} from "express";

const needAuth = express.Router();

import {modifyUser} from "../../Controllers/User/Post/user";
import {deleteUser, deleteUserByToken} from "../../Controllers/User/Delete/user";

needAuth.put('/modifyUser', modifyUser);
needAuth.delete('/deleteUser', deleteUser);
needAuth.delete('/deleteUserByToken', deleteUserByToken);


module.exports = needAuth;