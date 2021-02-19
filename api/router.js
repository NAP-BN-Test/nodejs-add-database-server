module.exports = function (app) {
    var controller = require('./controller/controller');
    var webController = require('./controller/web-controller');

    app.route('/nap/create_db').post(controller.createDB);

    app.route('/nap/create_table').post(controller.createTable);

    app.route('/nap/add_database_table').post(controller.addDatabaseToTable);
    app.route('/nap/insert_country').post(controller.insertCountry);
    app.route('/nap/insert_city').post(controller.insertCity);
    app.route('/nap/insert_port').post(controller.insertPort);

    app.route('/nap/add_relation_table').post(controller.addRelationTable);

    app.route('/nap/create_login').post(controller.createLogin);
    
    app.route('/nap/map_login_data').post(controller.setLoginUseData);

    app.route('/nap/add_customer').post(controller.addCustomer);

    app.route('/nap/delete_db').post(controller.deleteDB);

    app.route('/nap/add_config_database').post(controller.addInfoToTableSystem);

    app.route('/nap/get_list_customer').post(controller.getListCustomer);

    app.route('/nap/change_status').post(controller.changeStatus);

    app.route('/nap/change_expire_date').post(controller.changeExpireDate);

    app.route('/nap/get_customer_by_key').post(controller.getCustomerByKey);


    app.route('/nap/web_register').post(webController.webSendRegister);

}