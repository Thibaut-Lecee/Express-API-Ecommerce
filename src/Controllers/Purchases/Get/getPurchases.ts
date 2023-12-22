import {PrismaClient} from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

interface Purchases {
    id: number;
    articleId: number;
    userId: number;
    boughtAt: Date;
}

export const getPurchases = async (req: express.Request, res: express.Response) => {
    try {
        const purchases: Purchases[] = await prisma.purchases.findMany();
        res.status(200).send({message: "Commandes", purchases});
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
}

export const getPurchasesByClient = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).send({message: "Missing user ID"});
        }
        const purchases: Purchases[] = await prisma.purchases.findMany({
            where: {
                userId: parseInt(id.toString(), 10),
            },
        });
        if (purchases.length === 0) {
            return res.status(204).send()
        }
        res.status(200).send(purchases);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
}


export const getPurchasesByArticle = async (req: express.Request, res: express.Response) => {
    try {
        const {articleId} = req.params;
        if (!articleId) {
            return res.status(400).send({message: "Missing article ID"});
        }
        const purchases: Purchases[] = await prisma.purchases.findMany({
            where: {
                articleId: parseInt(articleId.toString(), 10),
            },
        });
        res.status(200).send(purchases);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
}