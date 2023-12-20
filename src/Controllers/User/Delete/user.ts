import {PrismaClient} from "@prisma/client";
import * as QueryString from "querystring";
import express from "express";
import {getTokenFromHeaders} from "../../../Utils/jwt";

const prisma = new PrismaClient();

export const deleteUserByToken = async (req: express.Request, res: express.Response) => {
    try {
        const tokenPayload = getTokenFromHeaders(req)
        if (!tokenPayload) {
            return res.status(400).send({message: "Missing user ID"});
        }
        const user = await prisma.user.findUnique({
            where: {
                id: tokenPayload.id,
            },
        });
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        const deletedUser = await prisma.user.delete({
            where: {
                id: tokenPayload.id,
            },
        });
        return res.status(200).send({message: "User deleted successfully", deletedUser});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: error.message});
    }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).send({message: "Missing user ID"});
        }
        const userId = parseInt(id.toString(), 10)
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        const deletedUser = await prisma.user.delete({
            where: {
                id: userId,
            },
        });
        return res.status(200).send({message: "User deleted successfully", deletedUser});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: error.message});
    }
};
