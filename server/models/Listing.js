const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: DataTypes.STRING,
  subcategory: DataTypes.STRING,
  location: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.STRING,
  availability: DataTypes.STRING,
  image: DataTypes.STRING,
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  ratingsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'listings',
  timestamps: true
});

// Add a hook to log when a listing is found
Listing.afterFind((result) => {
  console.log('Listing found:', result);
});

module.exports = Listing;
