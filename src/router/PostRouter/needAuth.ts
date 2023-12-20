import express, {request} from "express";
const needAuth = express.Router();

import {modifyUser} from "../../Controllers/User/Post/user";
import {deleteUser} from "../../Controllers/User/Delete/user";

needAuth.put('/modifyUser', modifyUser);
needAuth.delete('/deleteUser', deleteUser);

module.exports = needAuth;