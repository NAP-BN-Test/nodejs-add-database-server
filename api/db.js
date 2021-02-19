const Sequelize = require('sequelize');

module.exports = {
    connectDB: async function (ip, dbName, username, password, secretKey) {
        if (secretKey == '00a2152372fa8e0e62edbb45dd82831a') {
            const dbServer = new Sequelize(dbName, username, password, {
                host: ip,
                dialect: 'mssql',
                operatorsAliases: '0',
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },
                define: {
                    timestamps: false,
                    freezeTableName: true
                }
            });

            try {
                await dbServer.authenticate();
                return Promise.resolve(dbServer);
            } catch (error) {
                dbServer.close();
                return Promise.reject({
                    status: 0,
                    message: "Lỗi xử lý hệ thống!"
                })
            }
        } else {
            return Promise.reject({
                status: 0,
                message: "Không có quyền truy cập!"
            })
        }
    },
}