import Joi from 'joi';
import express from 'express';

// Middleware de validation pour la création d'un achat
export const validatePurchase = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const schema = Joi.object({
        userId: Joi.number().required(),
        articleId: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
    });
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).send({message: error.details[0].message});
    }
    next();
};

export const validateCreateUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    });
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).send({message: error.details[0].message});
    }
    next();
}

export const validateCreateArticle = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const schema = Joi.object({
        title: Joi.string().min(5).required(),
        description: Joi.string(),
        price: Joi.number(),
        quantity: Joi.number()
    })
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).send({message: error.details[0].message})
    }
    next();
}
