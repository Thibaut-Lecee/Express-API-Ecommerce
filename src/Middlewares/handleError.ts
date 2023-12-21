import express from 'express';

// Middleware de gestion des erreurs
export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err); // Log de l'erreur
    res.status(500).send({message: 'Une erreur est survenue'});
};
