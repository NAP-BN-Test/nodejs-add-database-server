const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Customer', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        IDContract: Sequelize.BIGINT,
        ExpirationDate: Sequelize.DATE,
        ServerIP: Sequelize.STRING,
        KeyLicense: Sequelize.STRING,
        ActiveStatus: Sequelize.BOOLEAN,
        DatabaseName: Sequelize.STRING,
        Username: Sequelize.STRING,
        Password: Sequelize.STRING,
        FlagDemo: Sequelize.INTEGER,
        FtpIP: Sequelize.STRING,
        FtpUser: Sequelize.STRING,
        FtpPass: Sequelize.STRING,
        CreatedTime: Sequelize.NOW,
        UpdatedTime: Sequelize.NOW
    });
    return table;
}