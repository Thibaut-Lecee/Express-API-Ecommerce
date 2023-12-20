import {PrismaClient} from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

interface userDto {
    name: string;
    email: string;

}


export const getAllUsers = async (res: express.Response) => {
    try {

        const allUsers = await prisma.user.findMany();
        const users: userDto[] = [];
        for (const user of allUsers) {
            const userDto: userDto = {
                email: user.email,
                name: user.firstname + " " + user.lastname,
            }
            users.push(userDto);
        }
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};

export const getUserById = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.body.id;
        if (!id) {
            return res.status(400).send({message: "Missing user ID"});
        }
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        const userDto: userDto = {
            name: user.firstname + " " + user.lastname,
            email: user.email,

        }
        return res.status(200).send(userDto);
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}

export const getUserByEmail = async (req: express.Request, res: express.Response) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).send({message: "Missing user email"});
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        const userDto: userDto = {
            name: user.firstname + " " + user.lastname,
            email: user.email,
        }
        return res.status(200).send(userDto);
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}