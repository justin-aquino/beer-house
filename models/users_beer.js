'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_beer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users_beer.init({
    userId: DataTypes.INTEGER,
    beerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users_beer',
  });
  return users_beer;
};