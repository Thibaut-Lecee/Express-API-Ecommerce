import {PrismaClient} from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();


interface Purchases {
    quantity: number;
    price: number;
    boughtAt: Date;
}


const checkUser = async (userId: number) => {
    try {
        return await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

    } catch (e) {
        console.error(e);
        return false;
    }
}
export const createPurchase = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {userId, articleId, quantity} = req.body;
        if (!userId || !articleId) {
            return res.status(400).send({message: "Missing user ID or article ID"});
        }
        const message = await modifyQuantityArticles(articleId, quantity);
        if (message !== "Success") {
            return res.status(400).send({message: message});
        }
        const userAvailable = await checkUser(userId);
        if (!userAvailable) {
            return res.status(404).send({message: "User or article not found"});
        }
        const article = await getArticleById(articleId);
        if (!article) {
            return res.status(404).send({message: "Article not found"});
        }
        const purchase = await prisma.purchases.create({
            data: {
                userId: userId,
                articleId: articleId,
                quantity: quantity,
                boughtAt: new Date(),
            },
        });
        const purchaseToClient: Purchases = {
            quantity: purchase.quantity,
            price: purchase.quantity * article.price,
            boughtAt: purchase.boughtAt,
        }
        res.status(201).send(purchaseToClient);
    } catch (e) {
        console.error(e);
        next(e);
    }
}

const increaseOrDecreaseQuantity = async (articleId: number, quantity: number) => {
    try {

    } catch (e) {
        console.error(e);
        return e.message;
    }
}
const modifyQuantityArticles = async (articleId: number, quantity: number) => {
    try {
        const article = await getArticleById(articleId)
        if (!article) {
            return "Article not found";
        }
        const newQuantity = article.quantity - quantity;
        if (newQuantity < 0) {
            return "Not enough articles in stock";
        }
        await prisma.articles.update({
            where: {
                id: articleId,
            },
            data: {
                quantity: newQuantity,
            },
        });
        return "Success";
    } catch (e) {
        console.error(e);
        return e.message;
    }

}
export const modifyPurchase = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {userId, articleId, quantity} = req.body;
        const {id} = req.params;
        if (!userId || !articleId) {
            return res.status(400).send({message: "Missing user ID or article ID"});
        }
        const getPurchase = await prisma.purchases.findUnique({
            where: {
                id: parseInt(id.toString(), 10),
            },
        });
        const getArticle = await getArticleById(articleId);
        if (!getArticle) {
            return res.status(404).send({message: "Article not found"});
        }


        if (!getPurchase) {
            return res.status(404).send({message: "Purchase not found"});
        }
        const purchase = await prisma.purchases.update({
            where: {
                id: parseInt(id.toString(), 10),
            },
            data: {
                userId: userId,
                articleId: articleId,
                quantity: getPurchase.quantity + quantity,
            },
        });
        if (!purchase) {
            return res.status(404).send({message: "Purchase not found"});
        }
        const message = await modifyQuantityArticles(articleId, quantity);
        if (message !== "Success") {
            return res.status(400).send({message: message});
        }
        const purchaseToClient: Purchases = {
            quantity: purchase.quantity,
            price: getArticle.price * purchase.quantity,
            boughtAt: purchase.boughtAt,
        }
        res.status(201).send(purchaseToClient);
    } catch (e) {
        console.error(e);
        next(e)
    }
}

const getArticleById = async (articleId: number) => {
    try {
        return await prisma.articles.findUnique({
            where: {
                id: articleId,
            },
        });
    } catch (e) {
        console.error(e);
        return false;
    }
}