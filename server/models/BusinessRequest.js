const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BusinessRequest = sequelize.define('BusinessRequest', {
  full_name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  password: DataTypes.STRING,
  business_name: DataTypes.STRING,
  business_type: DataTypes.STRING,
  city: DataTypes.STRING,
  address: DataTypes.TEXT,
  business_email: DataTypes.STRING,
  business_phone: DataTypes.STRING,
  license_url: DataTypes.STRING,
  letter_url: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});

module.exports = BusinessRequest;
