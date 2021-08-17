/* eslint-disable no-undef */
/**
 * User Schema
 */
module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cap: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false
        },
        link: {
            type: DataTypes.STRING(1024),
            allowNull: false
        }
    }, { timestamps: false, });

    return Company;
};