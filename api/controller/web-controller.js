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

var secretKey = 'c74449f1f663f1d3037152dd768d8f89';

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

function sendEmail(email, dbName, username, password, nameFile) {
    var transporter = nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'Info.namanphu@gmail.com',
            pass: '123456a$'
        }
    });

    let link = "http://download.namanphu.com.vn/" + nameFile + ".rar";
    let serverIP = "163.44.192.123";
    let ftpAddress = "ftp://163.44.192.123";
    let ftpUser = "ftpuser";
    let ftpPass = "123456a$";

    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'NAP LOCY',
        to: email,
        subject: 'Thông tin, tải xuống phần mềm LOCY',
        text: 'You recieved message from NAP',
        html: `
        <p>Xin cảm ơn bạn đ&atilde; đăng k&yacute; sử dụng phần mềm <strong>Giải ph&aacute;p phần mềm quản l&yacute; Logistic &ndash; LOCY</strong></p>
        <p>Vui l&ograve;ng bấm v&agrave;o đường dẫn sau để tải phần mềm về m&aacute;y <a href="${link}">tại đây</a></p>
        <p>&nbsp;</p>
        <p>TH&Ocirc;NG TIN ĐĂNG NHẬP V&Agrave; CẤU H&Igrave;NH SERVER CỦA BẠN</p>
        <ul>
        <li>ServerIP:&nbsp;<em>${serverIP}</em></li>
        <li>Username:&nbsp;<em>${username}</em></li>
        <li>Password:&nbsp;<em>${password}</em></li>
        <li>DbName: <em>${dbName}</em></li>
        <li>FtpAddress:&nbsp;<em>${ftpAddress}</em></li>
        <li>FtpUser:&nbsp;<em>${ftpUser}</em></li>
        <li>FtpPassword:&nbsp;<em>${ftpPass}</em></li>
        </ul>
        <p>Trong trường hợp c&ograve;n vấn đề vướng mắc vui l&ograve;ng li&ecirc;n hệ trực tiếp với ch&uacute;ng t&ocirc;i</p>
        <p>C&Ocirc;NG TY CỔ PHẦN C&Ocirc;NG NGHỆ NAM AN PH&Uacute;</p>
        <p>Địa chỉ: Tầng 18, T&ograve;a nh&agrave; Twin Tower, Linh Đ&agrave;m, H&agrave; Nội</p>
        <p>Hotline:&nbsp; <span style="color: #3366ff;">024 3550 1618 - 024 3550 1919</span></p>
        <p>Email: <span style="color: #3366ff;">info.namanphu@gmail.com</span></p>
        `
    }

    transporter.sendMail(mainOptions, function () { });
}


module.exports = {

    webSendRegister: async (req, res) => {
        let body = req.body;
        if (secretKey == body.secretKey) {

            var queryAddDB = await mQuery.createDB(body.dbName);
            request.query(queryAddDB).then(async () => {// add Database without table

                var queryAddTable = await mQuery.addTable(body.dbName);
                request.query(queryAddTable).then(async () => { // add table for database added

                    var queryAddData = await mQuery.addTableData(body.dbName);
                    request.query(queryAddData).then(async () => { // add data for database added

                        var queryAddCountry = await mQuery.addTableCountry(body.dbName);
                        request.query(queryAddCountry).then(async () => { // add data for database added

                            var queryAddCity = await mQuery.addTableCity(body.dbName);
                            request.query(queryAddCity).then(async () => { // add data for database added

                                var queryAddPort = await mQuery.addTablePort(body.dbName);
                                request.query(queryAddPort).then(async () => { // add data for database added

                                    var queryAddRelation = await mQuery.addTableRelation(body.dbName);
                                    request.query(queryAddRelation).then(async () => { // add relation for database added

                                        var queryAddLogin = await mQuery.createLogin(body.username, "123456a$");
                                        request.query(queryAddLogin).then(async () => { // add new login on mssql

                                            var queryMapLoginWithDB = await mQuery.setLoginOnData(body.username, body.dbName);
                                            request.query(queryMapLoginWithDB).then(async () => { // add new login on mssql

                                                database.connectDB('163.44.192.123', 'CustomerDB', 'customeruser', '123456a$', body.secretKey).then(db => {
                                                    db.authenticate().then(() => {
                                                        var known = '';
                                                        if (body.isFacebook)
                                                            known += 'Facebook'
                                                        if (body.isWebsite)
                                                            known += 'Website'
                                                        if (body.isFriends)
                                                            known += 'Friends'
                                                        mContract(db).create({
                                                            Duration: 30,
                                                            CustomerName: body.customerName,
                                                            Known: known,
                                                            TotalUser: body.totalUser
                                                        }).then(contract => {
                                                            mCustomer(db).create({
                                                                IDContract: contract.dataValues.ID,
                                                                ExpirationDate: moment(moment().valueOf() + 30 * 86400000).format('YYYY-MM-DD'),
                                                                ServerIP: '163.44.192.123',
                                                                KeyLicense: body.key,
                                                                ActiveStatus: true,
                                                                DatabaseName: body.dbName,
                                                                Username: body.username,
                                                                Password: "123456a$",
                                                                CreatedTime: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                                                                UpdatedTime: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                                                            }).then(() => {

                                                                database.connectDB('163.44.192.123', body.dbName, body.username, "123456a$", body.secretKey).then(db => {
                                                                    db.authenticate().then(() => {
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

                                                                            sendEmail(body.email, body.dbName, body.username, "123456a$", body.nameFile);

                                                                            res.json({ status: 1 })
                                                                        }).catch(() => {
                                                                            res.json(errorResult(body.dbName, 'Thêm config thất bại'))
                                                                        })
                                                                    })
                                                                })


                                                            }).catch(() => {
                                                                res.json(errorResult(body.dbName, 'Thêm thông tin server thất bại'))
                                                            })
                                                        }).catch(() => {
                                                            res.json(errorResult(body.dbName, 'Thêm khách hàng thất bại'))
                                                        })
                                                    }).catch(() => {
                                                        res.json(errorResult(body.dbName, 'Kết nối server thất bại'))
                                                    })
                                                })

                                            }).catch(async () => {
                                                var queryDeteleDB = await mQuery.deleteDB(body.dbName);
                                                request.query(queryDeteleDB).then(async () => {
                                                    var queryDeteleLogin = await mQuery.deleteDB(body.username);
                                                    request.query(queryDeteleLogin).then(() => {

                                                        res.json({ status: 0, message: 'Thiết lập thất bại' });

                                                    });
                                                });
                                            })

                                        }).catch(async () => {
                                            var queryDeteleLogin = await mQuery.deleteLogin(body.username);
                                            request.query(queryDeteleLogin);
                                        })

                                    }).catch((err) => {
                                        res.json(errorResult(body.dbName, 'Thêm quan hệ bảng bị lỗi'))
                                    })

                                }).catch(() => {
                                    res.json(errorResult(body.dbName, 'Thêm port vào bảng bị lỗi'))
                                })

                            }).catch(() => {
                                res.json(errorResult(body.dbName, 'Thêm city vào bảng bị lỗi'))
                            })

                        }).catch(() => {
                            res.json(errorResult(body.dbName, 'Thêm nước vào bảng bị lỗi'))
                        })

                    }).catch(() => {
                        res.json(errorResult(body.dbName, 'Thêm data vào bảng bị lỗi'))
                    })

                }).catch(() => {
                    res.json(errorResult(body.dbName, 'Thêm bảng vào db bị lỗi'))
                })

            }).catch(() => {
                res.json(errorResult(body.dbName, 'Tạo db lỗi hoặc đã có db'))
            })
        } else {
            res.json({ status: 0, message: "Không có quyền truy cập" })
        }


    },
}