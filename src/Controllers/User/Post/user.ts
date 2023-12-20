import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
    name: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}

type userDto = {
    id: number;
    name: string;
    email: string;
    firstname?: string;
    lastname?: string;
}

export const createUser = async (req: express.Request, res: express.Response) => {
    try {
        const {name, email, password, firstname, lastname} = req.body as User;
        if (!name.trim() || !email.trim() || !password.trim() || !firstname.trim() || !lastname.trim()) {
            return res.status(400).send({message: "All fields are required and cannot be empty"});
        }
        // Validation: vérifier le format de l'email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({message: "Invalid email format"});
        }
        const uniqueUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (uniqueUser) {
            res.status(400).send({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                firstname,
                email,
                password: hashedPassword,
                lastname,
            },
        });
        const userDto: userDto = {
            id: newUser.id,
            name: newUser.firstname + " " + newUser.lastname,
            email: newUser.email,

        }
        res.status(201).send(userDto);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: error.message});
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
        const passwordMatch = await bcrypt.compare(password, User.password);
        if (!passwordMatch) {
            return res.status(400).send({message: "Invalid password"});
        }

        const userDto: userDto = {
            id: User.id,
            name: User.firstname + " " + User.lastname,
            email: User.email,
        };
        const token = jwt.sign({email: User.email, id: User.id}, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        return res.status(200).send({userDto, token});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
};

export const modifyUser = async (req: express.Request, res: express.Response) => {
    try {
        const {firstname, email, lastname} = req.body;

        // Validation: vérifier le format de l'email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({message: "Invalid email format"});
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
                firstname: firstname,
                lastname: lastname,
                email: email,
            },
        });
        const userDto: userDto = {
            id: updatedUser.id,
            name: updatedUser.firstname + " " + updatedUser.lastname,
            email: updatedUser.email,
        };
        res.status(200).send(userDto);

    } catch (error) {
        console.error(error);
        res.status(500).send({message: error.message});
    }
}