import jwt  from "jsonwebtoken";
import  "dotenv";
import user from "../models/user.js";

const authmiddleware = (req, res, next) => {
  let authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).send({ 
      success: false,
      message: "Header authorization is required!",
      data: {}
    });
  }
  
  let token = authHeader.split("Bearer ")[1];

  jwt.verify(token, process.env.JWT_TOKEN || 'tes', async (err, decoded) => {
    if (err) {
      return res.status(403).send({ 
          success: false,
          message: "Your Token is Longer Valid!",
          data: {}
        });
    }

    var dataUser = await user.findOne({id: decoded.id});

    if(dataUser)
    {
      req.user = dataUser.dataValues;
      next();
    } else {
      return res.status(403).send({ 
        success: false,
        message: "User not found!",
        data: {}
      });
    }
  });
};

export default authmiddleware;