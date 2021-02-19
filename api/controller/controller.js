const Sequelize = require('sequelize');
const Op = require('sequelize').Op;

var nodemailer = require('nodemailer');

var moment = require('moment')

var database = require('../db');
var mQuery = require('../query');

var mContract = require('../table/contract')
var mCustomer = require('../table/server')

var sql = require("mssql");
var request;

var config = {
    user: 'sa',
    password: 'Giai@Phap#Viet$213%171^198',
    server: '163.44.192.123',
    database: 'master',
    requestTimeout: 1000000,
};

sql.connect(config, function (err) {
    request = new sql.Request();
})

async function errorResult(dbName, message) {
    if (dbName) {
        sql.connect(config, async function (err) {
            var request = new sql.Request();
            var query = await mQuery.deleteDB(dbName);
            request.query(query).catch(() => {
                return {
                    status: 0,
                    message: message
                }
            })
        });
    }
    return {
        status: 0,
        message: message
    }
}

module.exports = {
    addCustomer: async (req, res) => { // 2nd step

        let body = req.body;

        database.connectDB('163.44.192.123', 'CustomerDB', 'customeruser', '123456a$', body.secretKey).then(async db => {

            mContract(db).create({
                Duration: Number(body.duration),
                CustomerName: body.customerName,
                Email: body.email
            }).then(contract => {

                let expireDate;
                if (body.duration) {
                    expireDate = moment(moment().valueOf() + Number(body.duration) * 86400000).format('YYYY-MM-DD');
                } else {
                    expireDate = moment(moment().valueOf() + 30 * 86400000).format('YYYY-MM-DD');
                }

                mCustomer(db).create({
                    IDContract: contract.ID,
                    ExpirationDate: expireDate,
                    ServerIP: '163.44.192.123',
                    KeyLicense: body.key,
                    ActiveStatus: true,
                    DatabaseName: body.dbName,
                    Username: body.username,
                    Password: '123456a$',
                    CreatedTime: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                    UpdatedTime: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                }).then(() => {
                    var obj = {
                        key: body.key,
                        customerName: body.customerName,
                    }
                    var result = {
                        status: 1,
                        obj
                    }

                    res.json(result)

                }).catch(() => {
                    res.json(errorResult(body.dbName, 'Thêm thông tin server thất bại'))
                })
            }).catch(() => {
                res.json(errorResult(body.dbName, 'Thêm khách hàng thất bại'))
            })

        })

    },

    createDB: async (req, res) => {
        let body = req.body;

        var queryAddDB = await mQuery.createDB(body.dbName);

        request.query(queryAddDB).then(() => {// add Database without table
            res.json({ status: 1 })
        }).catch(() => {
            res.json(errorResult(body.dbName, 'Tạo db lỗi hoặc đã có db'))
        })

    },

    createTable: async (req, res) => {
        let body = req.body;

        var queryAddTable = await mQuery.addTable(body.dbName);

        request.query(queryAddTable).then(() => { // add table for database added
            res.json({ status: 1 })
        }).catch(() => {
            res.json(errorResult(body.dbName, 'Thêm bảng vào db bị lỗi'))
        })

    },

    addDatabaseToTable: async (req, res) => {
        let body = req.body;

        var queryAddData = await mQuery.addTableData(body.dbName);

        request.query(queryAddData).then(() => { // add data for database added
            res.json({ status: 1 })
        }).catch(() => {
            res.json(errorResult(body.dbName, 'Thêm data vào bảng bị lỗi'))
        })

    },

    insertCountry: async (req, res) => {
        let body = req.body;

        var queryAddData = await mQuery.addTableCountry(body.dbName);

        request.query(queryAddData).then(() => { // add data for database added
            res.json({ status: 1 })
        }).catch(() => {
            res.json(errorResult(body.dbName, 'Thêm nước vào bảng bị lỗi'))
        })

    },

    insertCity: async (req, res) => {
        let body = req.body;

        var queryAddData = await mQuery.addTableCity(body.dbName);

        request.query(queryAddData).then(() => { // add data for database added
            res.json({ status: 1 })
        }).catch(() => {
            res.json(errorResult(body.dbName, 'Thêm city vào bảng bị lỗi'))
        })

    },

    insertPort: async (req, res) => {
        let body = req.body;

        var queryAddData = await mQuery.addTablePort(body.dbName);

        request.query(queryAddData).then(() => { // add data for database added
            res.json({ status: 1 })
        }).catch(() => {
            res.json(errorResult(body.dbName, 'Thêm port vào bảng bị lỗi'))
        })

    },

    addRelationTable: async (req, res) => {
        let body = req.body;

        var queryAddRelation = await mQuery.addTableRelation(body.dbName);

        request.query(queryAddRelation).then(() => { // add relation for database added
            res.json({ status: 1 })
        }).catch((err) => {
            console.log(err);
            res.json(errorResult(body.dbName, 'Thêm quan hệ bảng bị lỗi'))
        })

    },

    createLogin: async (req, res) => {
        let body = req.body;

        var queryAddLogin = await mQuery.createLogin(body.username, '123456a$');

        request.query(queryAddLogin).then(() => { // add new login on mssql
            res.json({ status: 1 })
        }).catch(() => {
            mQuery.deleteLogin(body.username).then(queryDeteleLogin => {
                request.query(queryDeteleLogin);
            })
        })

    },

    setLoginUseData: async (req, res) => {
        let body = req.body;

        var queryMapLoginWithDB = await mQuery.setLoginOnData(body.username, body.dbName);

        request.query(queryMapLoginWithDB).then(() => { // add new login on mssql
            res.json({ status: 1 })
        }).catch(async () => {
            var queryDeteleDB = await mQuery.deleteDB(body.dbName);

            request.query(queryDeteleDB).then(async () => {

                var queryDeteleLogin = await mQuery.deleteDB(body.username);

                request.query(queryDeteleLogin).then(() => {

                    res.json({ status: 0, message: 'Thiết lập thất bại' });

                });
            })
        })

    },

    deleteDB: async (req, res) => {
        let body = req.body;


        database.connectDB('163.44.192.123', 'CustomerDB', 'customeruser', '123456a$', body.secretKey).then(async db => {

            mCustomer(db).findOne({ where: { ID: body.id } }).then(customer => {
                let contractID = customer.IDContract;

                mCustomer(db).destroy({ where: { ID: body.id } }).then(() => {

                    mContract(db).destroy({ where: { ID: contractID } }).then(async () => {

                        var queryDeteleDB = await mQuery.deleteDB(body.dbName);
                        request.query(queryDeteleDB).then(async () => {

                            var queryDeteleLogin = await mQuery.deleteLogin(body.username);
                            request.query(queryDeteleLogin).then(() => {
                                res.json({ status: 1, message: 'Thao tác thành công' })
                            }).catch((err) => {
                                console.log(err);
                                res.json({ status: 1, message: 'Thao tác thành công' })

                            });
                        })
                    }).catch(() => {
                        res.json({ status: 1, message: 'Thao tác thành công' })

                    });

                })
            })

        })

    },

    addInfoToTableSystem: async (req, res) => {  // 3rd step
        let body = req.body;

        database.connectDB('163.44.192.123', body.dbName, body.username, '123456a$', body.secretKey).then(async db => {
            var tbSysem = db.define('tblSysConfig', {
                ID: {
                    type: Sequelize.BIGINT,
                    primaryKey: true,
                    autoIncrement: true
                },
                APPKEY: Sequelize.STRING,
                SERVERIP: Sequelize.STRING,
                CUSTOMERNAME: Sequelize.STRING,
                FLAGUSE: Sequelize.INTEGER,
                FLAG: Sequelize.INTEGER
            });

            tbSysem.create({
                APPKEY: body.key,
                SERVERIP: '163.44.192.123',
                CUSTOMERNAME: body.customerName,
                FLAGUSE: 32678668,
                FLAG: 365686686
            }).then(() => {
                res.json({ status: 1 })
            }).catch(() => {
                res.json(errorResult(body.dbName, 'Thêm config thất bại'))
            })
        })

    },

    getListCustomer: async (req, res) => {
        let body = req.body;

        database.connectDB('163.44.192.123', 'CustomerDB', 'customeruser', '123456a$', body.secretKey).then(async db => {

            var customer = mCustomer(db);
            customer.belongsTo(mContract(db), { foreignKey: 'IDContract', sourceKey: 'IDContract' });

            customer.findAll({
                include: {
                    model: mContract(db),
                    required: false,
                    where: { CustomerName: { [Op.like]: '%' + body.searchKey + '%' } }
                },
                where: {
                    DatabaseName: { [Op.like]: '%' + body.searchKey + '%' },
                    Username: { [Op.like]: '%' + body.searchKey + '%' }
                },
                order: [['CreatedTime', 'DESC']],
                offset: 10 * (body.page - 1),
                limit: 10,
            }).then(list => {

                var array = [];

                list.forEach(item => {
                    array.push({
                        id: item.ID,
                        name: item.Contract ? item.Contract.CustomerName : "",
                        status: item.ActiveStatus,
                        expireDate: item.ExpirationDate,
                        dbName: item.DatabaseName,
                        username: item.Username,
                        updatedTime: item.UpdatedTime,
                        email: item.Contract ? item.Contract.Email : "",
                    })
                });

                let result = {
                    status: 1,
                    array
                }

                res.json(result);

            })

        })

    },

    changeStatus: async (req, res) => {
        let body = req.body;

        database.connectDB('163.44.192.123', 'CustomerDB', 'customeruser', '123456a$', body.secretKey).then(async db => {

            mCustomer(db).update(
                {
                    ActiveStatus: body.status,
                    UpdatedTime: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                },
                { where: { ID: body.customerID } }
            ).then(() => {
                let result = {
                    status: 1,
                    message: 'Thao tác thành công'
                }

                res.json(result);
            })
        })

    },

    changeExpireDate: async (req, res) => {
        let body = req.body;

        database.connectDB('163.44.192.123', 'CustomerDB', 'customeruser', '123456a$', body.secretKey).then(async db => {

            mCustomer(db).update(
                {
                    ExpirationDate: moment(body.expireDate).format('YYYY-MM-DD'),
                    UpdatedTime: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                },
                { where: { ID: body.customerID } }
            ).then(() => {
                let result = {
                    status: 1,
                    message: 'Thao tác thành công'
                }

                res.json(result);
            }).catch(() => {
                res.json(errorResult(null, 'Cập nhật thất bại'))

            })

        })

    },

    getCustomerByKey: async (req, res) => {
        let body = req.body;

        database.connectDB('163.44.192.123', 'CustomerDB', 'customeruser', '123456a$', body.secretKey).then(async db => {

            var customer = mCustomer(db);
            customer.belongsTo(mContract(db), { foreignKey: 'IDContract', sourceKey: 'IDContract' });

            customer.findOne({
                where: { KeyLicense: { [Op.like]: body.key } },
                include: { model: mContract(db), required: false },
            }).then((data) => {
                let obj = {
                    id: data.ID,
                    customerName: data.Contract.CustomerName,
                    expireDate: data.ExpirationDate,
                    serverIP: data.ServerIP,
                    activeStatus: data.ActiveStatus,
                    databaseName: data.DatabaseName,
                    username: data.Username,
                    password: data.Password,
                    flagDemo: data.FlagDemo,
                    ftpIP: data.FtpIP,
                    ftpUser: data.FtpUser,
                    ftpPass: data.FtpPass,
                }
                let result = {
                    status: 1,
                    obj
                }

                res.json(result);
            }).catch(() => {
                res.json(errorResult(null, 'Khách hàng không tồn tại'))

            })

        })

    },


}