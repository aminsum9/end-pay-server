import express from "express";
import User from "./controllers/User.js";
import "express-group-routes";
import authmiddleware from './middleware/authmiddleware.js';
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;

const corsOptions = {
  origin: '*',
}

const configuredCors = cors(corsOptions);

app.options('*', configuredCors)

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.group("/api/v1", router => {

    router.post("/user/check_login", authmiddleware, new User().check_login);
    router.post("/user/login", new User().login);
    router.post("/user/register", new User().register);

});