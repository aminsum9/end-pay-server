import express from "express";
import User from "./controllers/User.js";
import "express-group-routes";
import authmiddleware from './middleware/authmiddleware.js';
import bodyParser from "body-parser";
import cors from "cors";
import UserBallance from "./controllers/UserBallance.js";

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

    router.post("/user/check-login", authmiddleware, new User().check_login);
    router.post("/user/login", new User().login);
    router.post("/user/register", new User().register);

    router.post("/user/upgrade-premium",authmiddleware, new User().upgrade_premium);

    router.post("/userballance/get-user-ballance", authmiddleware, new UserBallance().get_user_ballance);
    router.post("/userballance/top-up-ballance", authmiddleware, new UserBallance().top_up_ballance);
    router.post("/userballance/transfer-ballance", authmiddleware, new UserBallance().transfer_ballance);
    router.post("/userballance/accept-topup", authmiddleware, new UserBallance().accept_topup);
    router.post("/userballance/reject-topup", authmiddleware, new UserBallance().reject_topup);
    router.post("/userballance/accept-transfer", authmiddleware, new UserBallance().accept_transfer);
    router.post("/userballance/reject-transfer", authmiddleware, new UserBallance().reject_transfer);

});