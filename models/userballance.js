"use strict";

import { DataTypes, Model } from 'sequelize';
import Sequelize from 'sequelize';

import sequelize from '../config/database.js'; 

class userballance extends Model {}

userballance.sequelize = sequelize;
userballance.Sequelize = Sequelize;

const userBallanceType = {
    DEBIT: 'debt', // mengurangi saldo
    CREDIT: 'credit', // tambah saldo
};

const userBallanceStatus = {
    PENDING: 'pending', 
    SUCCESS: 'success', 
    USED: 'used', 
    CANCEL: 'cancel', 
};

userballance.init({
        user_id: DataTypes.INTEGER,
        amount: DataTypes.INTEGER,
        type: {
            type: DataTypes.ENUM,
            values: Object.values(userBallanceType), 
            defaultValue: userBallanceType.CREDIT 
        },
        status: {
            type: DataTypes.ENUM,
            values: Object.values(userBallanceStatus), 
            defaultValue: userBallanceStatus.PENDING 
        },
    }, {
    sequelize,
    modelName: 'UserBallance'
});

export default userballance;
  