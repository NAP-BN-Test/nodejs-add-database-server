const Sequelize = require('sequelize');
const Op = require('sequelize').Op;

var moment = require('moment')

var database = require('../db');

var mContract = require('../table/contract')
var mCustomer = require('../table/server')

var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

async function awsSendEmail(emailRecive, name, time) {
    var subject = 'Thông báo sắp hết hạn dịch vụ';
    var body = `
                <p class="MsoNormal"><br></p><table class="MsoTableGrid" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td width="198" valign="top"></td><td width="425" valign="top"><p class="MsoNormal"><br></p><p class="MsoNormal">Kính gửi:&nbsp;<span style="font-weight: bolder;">${name}</span><br></p><div><span style="font-weight: bolder;"><br></span></div><div><p class="MsoNormal">Công ty Cổ Phần Công nghệ Nam An Phú trân trọng cảm ơn quý khách hàng đã quan tâm và sử dụng sản phẩm trong thời gian qua.</p><p class="MsoNormal">Chúng tôi kính gửi thông báo về việc sắp hết hạn sử dụng&nbsp;<span style="font-weight: bolder;">Giải pháp Phần mềm quản lý Logistics - LOCY</span>.</p><p class="MsoNormal">Phiên bản phần mềm của Quý vị hết thời hạn vào ngày:&nbsp;<span style="font-weight: bolder;">${time}</span></p><p class="MsoNormal">Quý Khách vui lòng liên hệ với bộ phận Kinh doanh của Nam An Phú để được hỗ trợ.&nbsp;</p><p class="MsoNormal">Trân Trọng Cảm ơn</p></div><div><br></div><div><img src="http://163.44.192.123:8552/LOGISTIC_CRM/1593420585538.png"><br></div><div><p class="MsoNormal"><span style="font-weight: bolder;"><span lang="EN-US">CÔNG TY CỔ PHẦN CÔNG NGHỆ NAM AN PHÚ</span></span></p><p class="MsoNormal"><span lang="EN-US">Địa chỉ: Tầng 18, Tòa nhà Twin Tower, Linh Đàm, Hà Nội</span></p><p class="MsoNormal"><span lang="EN-US">Hotline:&nbsp;&nbsp;024 3550 1618 - 024 3550 1919</span></p><p class="MsoNormal"><span lang="EN-US">Email:&nbsp;<a href="mailto:info.namanphu@gmail.com">info.namanphu@gmail.com</a></span></p></div>
                <p class="MsoNormal">&nbsp;</p>
                </td>
                </tr>
                </tbody></table>
                `

    return new Promise(res => {
        var ses = new AWS.SES();
        var params = {
            Destination: {
                BccAddresses: [], // bcc email
                CcAddresses: ['sonlm.nap@gmail.com'], // cc email
                ToAddresses: [
                    emailRecive
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: body
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: subject
                }
            },
            ReplyToAddresses: [],
            Source: 'info.namanphu@gmail.com',
        };
        ses.sendEmail(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                res();
            } else {
                res(1);
            }; // successful response
            /*
            data = {
             MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
            }
            */
        });
    })
}

module.exports = {
    checkExpire: async function () {

        database.connectDB('163.44.192.123', 'CustomerDB', 'customeruser', '123456a$', '00a2152372fa8e0e62edbb45dd82831a').then(async db => {
            try {
                var tenDayAgo = moment().add('days', -10).toDate();
                var tenDayNext = moment().add('days', 10).toDate();


                var customer = mCustomer(db);
                customer.belongsTo(mContract(db), { foreignKey: 'IDContract' });

                var customerData = await customer.findAll({
                    where: {
                        ExpirationDate: { [Op.lt]: tenDayNext },
                    },
                    include: {
                        model: mContract(db),
                        where: {
                            Email: { [Op.ne]: null },
                            [Op.or]: [
                                { TimeNoti: { [Op.lt]: tenDayAgo } },
                                { TimeNoti: null }
                            ],
                        }
                    }
                });

                customerData.forEach(async customerDataItem => {
                    var email = customerDataItem.Contract.Email;
                    var name = customerDataItem.Contract.CustomerName;
                    var time = moment(customerDataItem.ExpirationDate).format('DD/MM/YYYY');

                    awsSendEmail(email, name, time).then(async sendMailRes => {
                        if (sendMailRes == 1) {
                            console.log(customerDataItem.IDContract);
                            await mContract(db).update({
                                TimeNoti: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                            }, {
                                where: { ID: customerDataItem.IDContract }
                            })
                        }
                    })

                })

            } catch (error) {
                console.log(error);
                res.json({
                    status: 0,
                    message: 'Lỗi hệ thống!'
                })
            }
        })

    },

}