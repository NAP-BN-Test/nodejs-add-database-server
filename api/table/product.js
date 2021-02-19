const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Product', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ProductName: Sequelize.STRING,
        Description: Sequelize.STRING,
        ReleaseDate: Sequelize.DATE,
        Version: Sequelize.STRING
    });
    return table;
}