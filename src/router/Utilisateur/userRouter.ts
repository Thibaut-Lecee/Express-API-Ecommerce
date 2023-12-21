// Client (créer un compte, créer une commande, lister les produits)
import {Router} from 'express';

const userRouter = Router();
import {getAllArticles, getArticlesById, getArticlesByTitle} from "../../Controllers/Articles/Get/getArticle";
import {createPurchase} from "../../Controllers/Purchases/Post/postPurchases";


userRouter.route("/createPurchase").post(createPurchase);
userRouter.route("/getAllArticles").get(getAllArticles);
userRouter.route('/getArticlesById/:id').get(getArticlesById);
userRouter.route('/getArticlesByTitle/:title').get(getArticlesByTitle);

module.exports = userRouter;
