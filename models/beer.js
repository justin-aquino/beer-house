'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class beer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.beer.belongsTo(models.user)
      models.beer.belongsToMany(models.user, { through: "users_beers" })
    }
  }
  beer.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'beer',
  });
  return beer;
};