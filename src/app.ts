import express, {Application} from "express";
import limitRate from "express-rate-limit";
import {configRateLimit} from "./Middlewares/rateLimiter";
import './Middlewares/passport';
import configDotenv from 'dotenv';
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.json";
import morgan from "morgan";
import path from "path";
import {createAdminAccount, initializeRole} from "./Utils/initializeData";
import {checkRole} from "./Middlewares/passport";
import cors from "cors";
import helmet from "helmet";
import {errorHandler} from "./Middlewares/handleError";

const app: Application = express();
const port = 3000;
configDotenv.config();
app.use(morgan("tiny"));
app.use(passport.initialize());
// app.use(limitRate(configRateLimit));
const corsOptions = {
    origin: ['http://localhost:3000', 'https://localhost:3000', 'https://express-api-ecommerce.onrender.com', "https://localhost:3000"],
}
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
    res.send({title: 'API is running'});
});
app.get('/uploadImage', (req, res) => {
    res.sendFile(path.join(__dirname + '/htmlTemplate/uploadImage.html'));
})
app.use('/images', express.static('src/public/images'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/admin', passport.authenticate('jwt', {session: false}), checkRole(1), require('./router/Administrator/adminRouter'));
app.use('/api/manager', passport.authenticate('jwt', {session: false}), checkRole(2), require('./router/Manager/managerRouter'));
app.use('/api/user', passport.authenticate('jwt', {session: false}), checkRole(3), require('./router/Utilisateur/userRouter'));
app.use('/api/account', require('./router/Account/accountRouter'));
app.use(errorHandler);
app.listen(port, async () => {
    await initializeRole();
    await createAdminAccount({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        roleId: 1,
    })
    return console.log(`Express is listening at http://localhost:${port}`);
});