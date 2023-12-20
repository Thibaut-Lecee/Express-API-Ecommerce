import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config();

const params = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };

 passport.use(new JwtStrategy(params, (payload, done) => {
    if(payload.email) {
    return done(null, payload.email);
    }
    return done(null, false);
}));