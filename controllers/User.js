import user from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class User {

    check_login = (req, res) => {
        var dataUser = req.user;
    
        const token = jwt.sign({ id: dataUser.id }, process.env.JWT_TOKEN || 'tes',{ expiresIn: '1d' });
        user.findOne({
            where: {
                id: dataUser.id
            },
            attributes: {
                exclude: ['password']
            }
        }).then(data => {
            if(data)
            {
                res.send({
                    success: true,
                    message: "you logged in",
                    data: {...data.dataValues, token}
                });
            } else {
                res.send({
                    success: false,
                    message: "you don't logged in!",
                    data: {}
                });
            }
        });
    };
    
    login = async (req, res) => {
        if (!req.body.email || !req.body.password ) {
            res.send({
                message: "email and password is required!"
            });
        }
    
        var dataUser = await user.findOne({email: req.body.email})
    
        if(!dataUser)
        {
            res.send({
                success: false,
                message: `user with email ${req.body.email} not found!`,
                data: {}
            });
        }

        var checkPassword = await bcrypt.compare(req.body.password, dataUser.dataValues.password);
    
        if(!checkPassword)
        {
            res.send({
                success: false,
                message: "Password yang anda masukkan salah!",
                data: {}
            });
        }
    
        const token = jwt.sign({ id: dataUser.id }, process.env.JWT_TOKEN || 'tes', { expiresIn: '1d' });
    
        user.findOne({
            where: {id: dataUser.id},
            attributes: {
                exclude: ['password']
            }
        }).then(data => {
            if(data)
            {
                res.send({ 
                    success: true,
                    message: "login success!",
                    data: {
                        ...data.dataValues, token
                    }
                });
            } else {
                res.send({
                    success: false,
                    message: "login failed!",
                    data: {}
                });
            }
        });
    };
    
    register = async (req, res) => {
        if (!req.body.name || !req.body.username || !req.body.email || !req.body.password || !req.body.password_conf ) {
            res.send({
                success: false,
                message: "name, username, email, password, and password_conf is required!",
                data: {}
            });
        }
    
        if (req.body.password.length < 8) {
            res.send({
                success: false,
                message: "your password must be create at least 8 characters!",
                data: {}
            });
        }
    
        if (req.body.password != req.body.password_conf) {
            res.send({
                success: false,
                message: "your password and password_conf don't match!",
                data: {}
            });
        }

        var findUser = await user.findOne({
            where: {
                email: req.body.email
            },
            attributes: {
                exclude: ['password']
            }
        })

        console.log("findUser: ",findUser)

        if (findUser) {
            res.send({
                success: false,
                message: "email is already in use!",
                data: {}
            });
        }

        var hashingPassword = await bcrypt.hash(req.body.password, 10)

        console.log("hashingPassword: ",hashingPassword)
    
        var data = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashingPassword,
            is_verify: 0,
            account_type: 'reguler'
        }
    
        user.create(data).then(data => {
            if(data)
            {
                const token = jwt.sign({ id: data.id }, process.env.JWT_TOKEN || 'tes', { expiresIn: '1d' });
    
                res.send({
                    success: true,
                    message: "registration success",
                    data: {
                        ...data.dataValues, token
                    }
                });
            } else {
                res.send({
                    success: false,
                    message: "registation failed!",
                    data: {}
                });
            }
        });
    };

}

export default User;