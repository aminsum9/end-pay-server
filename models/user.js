"use strict";

import { DataTypes, Model } from 'sequelize';
import Sequelize from 'sequelize';

import sequelize from '../config/database.js'; 

class user extends Model {}

user.sequelize = sequelize;
user.Sequelize = Sequelize;

const accountTypes = {
  REGULER: 'reguler', 
  PREMIUM: 'premium', 
  GOLD: 'gold', 
  SILVER: 'silver', 
};

user.init({
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    select: false
  },
  account_type: {
    type: DataTypes.ENUM,
    values: Object.values(accountTypes), 
    defaultValue: accountTypes.REGULER 
  },
  is_verify: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'User'
});

export default user;
