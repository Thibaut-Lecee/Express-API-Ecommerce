import {PrismaClient} from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface userDto {
    name: string;
    email: string;
    surname: string;
}

const getTokenFromHeaders = (req: express.Request) => {
    const {headers: {authorization}} = req;
    if (authorization && authorization.split(" ")[0] === "Bearer") {
        const token = authorization.split(" ")[1];
        return jwt.verify(token, process.env.JWT_SECRET as string);
    }
    return null;
}
export const getAllUsers = async (res: express.Response) => {
    try {

        const allUsers = await prisma.user.findMany();
        const users: userDto[] = [];
        for (const user of allUsers) {
            const userDto: userDto = {
                name: user.name,
                email: user.email,
                surname: user.surname,
            }
            users.push(userDto);
        }
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};