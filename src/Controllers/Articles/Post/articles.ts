import express from "express";
import {PrismaClient} from "@prisma/client";
import multer from "multer";
import * as fs from "fs";

const prisma = new PrismaClient();

interface Articles {
    title: string;
    description: string;
    image: string;
    published: Date;
    price: number;
    quantity: number;
}

type articlesDto = {
    id: number;
    title: string;
    description: string;
    image: string;
    published: Date;
    price: number;
    quantity: number;
}

import path from 'path';


const createRepository = (dirPath) => {
    const resolvedPath = path.resolve(dirPath);
    if (!fs.existsSync(resolvedPath)) {
        fs.mkdirSync(resolvedPath, {recursive: true});
        console.log(`Le répertoire ${resolvedPath} a été créé.`);
    } else {
        console.log(`Le répertoire ${resolvedPath} existe déjà.`);
    }
};


export const handleImages = multer({
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            return cb(null, true);
        } else {
            return cb(new Error('Le format du fichier est invalide.'));
        }
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            createRepository('./src/public/images');
            cb(null, './src/public/images');
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
}).single('image');


export const createArticle = async (req: express.Request, res: express.Response,) => {
    const {title, description, published, price, quantity} = req.body as Articles;
    const image = req.file?.filename;
    try {
        if (!title || !description || !price || !quantity) {
            return res.status(400).json({message: "Veuillez remplir tous les champs"});
        }

        const uniqueArticle = await prisma.articles.findUnique({
            where: {
                title: title,
            }
        });
        if (uniqueArticle) {
            return res.status(409).json({message: "Cet article existe déjà"});
        }
        const publishedIso = new Date().toISOString();
        const priceNumber = parseInt(price.toString(), 10);
        const quantityNumber = parseInt(quantity.toString(), 10);
        const article = await prisma.articles.create({
            data: {
                title: title.toLowerCase(),
                description,
                image,
                published: publishedIso,
                price: priceNumber,
                quantity: quantityNumber,
            }
        });
        const articleAdd: articlesDto = {
            id: article.id,
            title: article.title,
            description: article.description,
            image: article.image,
            published: article.published,
            price: article.price,
            quantity: article.quantity,
        }
        return res.status(201).json({message: "L'article a bien été ajouté", articleAdd});
    } catch (error) {

        console.error(error);
        return res.status(500).json({message: error.message});
    }
};

export const modifyArticle = async (req: express.Request, res: express.Response,) => {
    const {id} = req.params;
    const {title, description, price, quantity} = req.body as Articles;
    const image = req.file?.filename;
    try {
        // update seulement les champs qui sont remplis dans le body
        // on pourrait également comparer avec les données actuelles de l'article
        const articleExist = await prisma.articles.findUnique({
            where: {
                id: parseInt(id),
            }
        });
        if (!articleExist) {
            return res.status(404).json({message: "Cet article n'existe pas"});
        }
        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (image) updateData.image = image;
        if (price) updateData.price = price;
        if (quantity) updateData.quantity = quantity + articleExist.quantity;

        const article = await prisma.articles.update({
            where: {id: parseInt(id)},
            data: updateData,
        });
        return res.status(200).json({message: "L'article a bien été modifié", article});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: error.message});
    }
};
