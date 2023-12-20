import express from "express";
const userPost = express.Router();
import {createUser, signIn} from "../../Controllers/User/Post/user";

userPost.post('/signIn', signIn);
userPost.post('/signUp', createUser);

module.exports = userPost;