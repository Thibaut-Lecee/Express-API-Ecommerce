import passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import dotenv from 'dotenv';

dotenv.config();

const params = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JwtStrategy(params, (payload, done) => {
    if (payload.user) {
        return done(null, payload.user);
    }
    return done(null, false);
}));

export const checkRole = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;

        if (user.role === requiredRole) {
            next();
        } else {
            res.status(403).send('Accès refusé petit malin !');
        }
    };
};