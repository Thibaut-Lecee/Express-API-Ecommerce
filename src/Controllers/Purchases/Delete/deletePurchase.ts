import {PrismaClient} from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

interface Purchases {
    id: number;
    articleId: number;
    userId: number;
    boughtAt: Date;
}


export const deletePurchaseById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params
        if (!id) {
            return res.status(400).send({message: "Missing purchase ID"});
        }
        const purchase = await prisma.purchases.findUnique({
            where: {
                id: parseInt(id.toString(), 10),
            },
        });
        if (!purchase) {
            return res.status(404).send({message: "Purchase not found"});
        }
        const deletePurchase = await prisma.purchases.delete({
            where: {
                id: parseInt(id.toString(), 10),
            },
        });
        res.status(200).send(deletePurchase);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}