const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        first_name: { type: DataTypes.STRING },
        last_name: { type: DataTypes.STRING },
        age: { type: DataTypes.INTEGER },
    }, {
        tableName: 'users',
        timestamps: false
    });
}