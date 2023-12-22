import {Router} from 'express';

const adminRouter = Router();

// Administrateur (Tout)
import {getAllArticles, getArticlesById, getArticlesByTitle} from "../../Controllers/Articles/Get/getArticle";
import {getAllUsers, getUserByEmail, getUserById} from "../../Controllers/User/Get/user";
import {getPurchases, getPurchasesByClient, getPurchasesByArticle} from "../../Controllers/Purchases/Get/getPurchases";
import {createArticle, modifyArticle} from "../../Controllers/Articles/Post/articles";
import {createPurchase, modifyPurchase} from "../../Controllers/Purchases/Post/postPurchases";
import {deleteArticle} from "../../Controllers/Articles/Delete/deleteArticle";
import {deletePurchaseById} from "../../Controllers/Purchases/Delete/deletePurchase";
import {signIn, createUser, modifyUser} from "../../Controllers/User/Post/user";
import {deleteUser} from "../../Controllers/User/Delete/user";
import {validateCreateUser, validatePurchase} from "../../Middlewares/handleData";

// articles routes
adminRouter.route("/allArticles").get(getAllArticles);
adminRouter.route('/articleById/:id').get(getArticlesById);
adminRouter.route('/articleByTitle/:title').get(getArticlesByTitle);
adminRouter.route("/createArticle").post(createArticle);
adminRouter.route("/modifyArticle/:id").patch(modifyArticle);
adminRouter.route("/deleteArticle/:id").delete(deleteArticle);

// purchases routes
adminRouter.route("/allPurchases").get(getPurchases);
adminRouter.route('/purchaseByClient/:id').get(getPurchasesByClient);
adminRouter.route("/createPurchase").post(validatePurchase, createPurchase);
adminRouter.route("/modifyPurchase/:id").patch(validatePurchase, modifyPurchase);
adminRouter.route("/deletePurchase/:id").delete(deletePurchaseById);

// users routes
adminRouter.route("/allUsers").get(getAllUsers);
adminRouter.route('/userById/:id').get(getUserById);
adminRouter.route('/userByEmail').get(getUserByEmail);
adminRouter.route("/signUp").post(validateCreateUser, createUser);
adminRouter.route("/signIn").post(signIn);
adminRouter.route("/modifyUser").patch(modifyUser);
adminRouter.route("/deleteUser").delete(deleteUser);

module.exports = adminRouter;