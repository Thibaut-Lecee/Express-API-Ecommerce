import express from "express";
import jwt from "jsonwebtoken";

export const getTokenFromHeaders = (req: express.Request)  => {
    const {headers: {authorization}} = req;
    if (authorization && authorization.split(" ")[0] === "Bearer") {
        const token = authorization.split(" ")[1];
        try {
            return jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    return null;
}