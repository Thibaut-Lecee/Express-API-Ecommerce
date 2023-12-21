import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
import express from "express";
import jwt from "jsonwebtoken";
import {comparePassword, encryptPassword} from "../../../Utils/encryptPassword";

interface User {
    name: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

type userDto = {
    id?: number;
    name: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: number;
}

export const createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {email, password, firstName, lastName} = req.body as User;

        const uniqueUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (uniqueUser) {
            return res.status(400).send({message: "User already exists"})
        }
        const hashedPassword = await encryptPassword(password, 10)
        const newUser = await prisma.user.create({
            data: {
                firstName,
                email,
                password: hashedPassword,
                lastName,
                roleId: 3,
            },
        });
        const userDto: userDto = {
            id: newUser.id,
            name: newUser.firstName + " " + newUser.lastName,
            email: newUser.email,

        }
        res.status(201).send({message: "Compte crée avec succès", userDto});
    } catch (error) {
        console.error(error);
        next(error)
    }
};

export const signIn = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;
        const User = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!User) {
            return res.status(400).send({message: "User doesn't exist"});

        }
        const passwordMatch = await comparePassword(password, User.password)
        if (!passwordMatch) {
            return res.status(400).send({message: "Invalid password"});
        }

        const userDto: userDto = {
            id: User.id,
            name: User.firstName + " " + User.lastName,
            email: User.email,
            role: User.roleId
        };
        const accessToken = jwt.sign({
            user: userDto
        }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        return res.status(200).send({userDto, accessToken});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
};

export const modifyUser = async (req: express.Request, res: express.Response) => {
    try {
        const {firstName, email, lastName, newEmail} = req.body;
        // Validation: vérifier le format de l'email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({message: "Invalid email format"});
        }
        // Validation: vérifier le format du nouveau email
        if (newEmail && !emailRegex.test(newEmail)) {
            return res.status(400).send({message: "Invalid new email format"});
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            res.status(400).send({message: "User doesn't exist"});
        }
        const updatedUser = await prisma.user.update({
            where: {
                email: user.email,
            },
            data: {
                firstName,
                lastName,
                email: newEmail,
            },
        });
        const userDto: userDto = {
            name: updatedUser.firstName + " " + updatedUser.lastName,
            email: updatedUser.email,
        };
        res.status(200).send(userDto);

    } catch (error) {
        console.error(error);
        res.status(500).send({message: error.message});
    }
}