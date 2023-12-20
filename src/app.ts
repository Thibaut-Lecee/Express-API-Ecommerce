import express, {Application} from "express";
import limitRate from "express-rate-limit";
import {configRateLimit} from "./Middlewares/rateLimiter";
import './Middlewares/passport';
import configDotenv from 'dotenv';
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.json";
import morgan from "morgan";

const app: Application = express();
const port = 3000;
configDotenv.config();
app.use(morgan("tiny"));
app.use(passport.initialize());
app.use(limitRate({
    windowMs: configRateLimit.windowMs,
    message: configRateLimit.message,
    standardHeaders: configRateLimit.standardHeaders,
    legacyHeaders: configRateLimit.legacyHeaders,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users/Get', passport.authenticate('jwt', {session: false}), require('./router/GetRouter/user'))
app.use('/api/users/Post', require('./router/PostRouter/user'))
app.use('/api/users/NeedAuth', passport.authenticate('jwt', {session: false}), require('./router/PostRouter/needAuth'))

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});