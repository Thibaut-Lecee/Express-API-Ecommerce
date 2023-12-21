import express from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

interface Articles {
    title: string;
    description: string;
    image: string;
    published: Date;
    price: number;
    quantity: number;
}

export const getAllArticles = async (req: express.Request, res: express.Response) => {
    try {
        const allArticles = await prisma.articles.findMany();
        return res.status(200).send({message: "All articles", allArticles});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: error.message});
    }
}

export const getArticlesById = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.params.id;
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
        const returnArticle: Articles = {
            title: findArticle.title,
            description: findArticle.description,
            image: findArticle.image,
            published: findArticle.published,
            price: findArticle.price,
            quantity: findArticle.quantity,
        }
        return res.status(200).send({message: "Article found", returnArticle});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: error.message});
    }
}

export const getArticlesByTitle = async (req: express.Request, res: express.Response) => {
    try {
        const {title} = req.params;
        console.log(title);
        if (!title) {
            return res.status(400).send({message: "Missing article title"});
        }
        const findArticle = await prisma.articles.findUnique({
            where: {
                title: title,
            },
        });
        if (!findArticle) {
            return res.status(404).send({message: "Article not found"});
        }
        const returnArticle: Articles = {
            title: findArticle.title,
            description: findArticle.description,
            image: findArticle.image,
            published: findArticle.published,
            price: findArticle.price,
            quantity: findArticle.quantity,
        }
        return res.status(200).send({message: "Article found", returnArticle});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: error.message});
    }
}