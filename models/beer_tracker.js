'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class beer_tracker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  beer_tracker.init({
    userId: DataTypes.INTEGER,
    beerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'beer_tracker',
  });
  return beer_tracker;
};