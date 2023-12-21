import express from "express";
import {PrismaClient} from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

interface Articles {
    title: string;
    description: string;
    image: string;
    published: Date;
    price: number;
    quantity: number;
}

const deleteImageFromRepository = (dirPath, fileName) => {
    const resolvedPath = path.resolve(dirPath, fileName);
    fs.unlinkSync(resolvedPath);
    console.log(`Le fichier ${resolvedPath} a été supprimé.`);
}

export const deleteArticle = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).send({message: "Missing article ID"});
        }
        const findArticle = await prisma.articles.findUnique({
            where: {
                id: parseInt(id.toString(), 10),
            },
        });
        if (!findArticle) {
            return res.status(404).send({message: "Article not found"});
        }

        const deleteImage = await prisma.articles.delete({
            where: {
                id: parseInt(id.toString(), 10),
            },
        });
        const returnDeleted: Articles = {
            title: deleteImage.title,
            description: deleteImage.description,
            image: deleteImage.image,
            published: deleteImage.published,
            price: deleteImage.price,
            quantity: deleteImage.quantity,
        }
        if (!deleteImage.image) {
            return res.status(204)
        }
        deleteImageFromRepository('./src/public/images', findArticle.image);
        return res.status(204)

    } catch (error) {
        console.error(error);
        return res.status(500).send({message: error.message});
    }
}