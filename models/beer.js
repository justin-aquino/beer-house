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
      // models.beer.belongsTo(models.user)
      models.beer.belongsToMany(models.user, { through: "users_beers" })
      models.beer.hasMany(models.review, {onDelete: "cascade"})
    }
  }
  beer.init({
    name: DataTypes.STRING,
    yeast_type: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'beer',
  });
  return beer;
};


// ASK SOMEONE HOW TO REMOVE A COLUMN FROM A TABLE.
// YOU DONT NEED THE TYPE COLUMN ON BEERS, CHANGE IT TO IMG SRC
//Also the manufacturer, exchange it with yeast.