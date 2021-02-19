const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Contract', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ContractName: Sequelize.STRING,
        SignedDate: Sequelize.DATE,
        Duration: Sequelize.INTEGER,
        CustomerName: Sequelize.STRING,
        Address: Sequelize.STRING,
        Cost: Sequelize.FLOAT,
        Email: Sequelize.STRING,
        Known: Sequelize.STRING,
        TotalUser: Sequelize.STRING,
        TimeNoti: Sequelize.NOW,
    });
    return table;
}