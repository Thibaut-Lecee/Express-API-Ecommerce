// - Gestionnaire (CRUD Commande, CRUD Produit)
import {Router} from 'express';

const managerRouter = Router();

import {getAllArticles, getArticlesById, getArticlesByTitle} from "../../Controllers/Articles/Get/getArticle";
import {getPurchases, getPurchasesByClient, getPurchasesByArticle} from "../../Controllers/Purchases/Get/getPurchases";
import {createArticle, modifyArticle} from "../../Controllers/Articles/Post/articles";
import {createPurchase, modifyPurchase} from "../../Controllers/Purchases/Post/postPurchases";
import {deleteArticle} from "../../Controllers/Articles/Delete/deleteArticle";
import {deletePurchaseById} from "../../Controllers/Purchases/Delete/deletePurchase";
import {validateCreateArticle} from "../../Middlewares/handleData";

// articles routes
managerRouter.route("/allArticles").get(getAllArticles);
managerRouter.route('/articleById/:id').get(getArticlesById);
managerRouter.route('/articleByTitle/:title').get(getArticlesByTitle);
managerRouter.route("/createArticle").post(validateCreateArticle, createArticle);
managerRouter.route("/modifyArticle/:id").patch(modifyArticle);
managerRouter.route("/deleteArticle/:id").delete(deleteArticle);

// purchases routes
managerRouter.route("/allPurchases").get(getPurchases);
managerRouter.route('/purchaseByClient/:userId').get(getPurchasesByClient);
managerRouter.route("/createPurchase").post(createPurchase);
managerRouter.route("/modifyPurchase/:id").patch(modifyPurchase);
managerRouter.route("/deletePurchase/:id").delete(deletePurchaseById);


module.exports = managerRouter;