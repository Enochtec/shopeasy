const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1 },
  },
}, {
  timestamps: true,
});

// Relationships: Cart is a many-to-many join table between User and Product with quantity info
Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cart, { foreignKey: 'userId' });

Cart.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Cart, { foreignKey: 'productId' });

module.exports = Cart;
