var fs = require("fs");

module.exports = {
    createDB: async function (dbName) {

        var query = fs.readFileSync('sql.txt', 'utf8');
        query = query.replace(/DB_NAME/g, dbName);

        return Promise.resolve(query)
    },

    addTable: async function (dbName) {

        var query = fs.readFileSync("sql-add-table.txt", 'utf8')
        query = query.replace(/DB_NAME/g, dbName);

        return Promise.resolve(query)
    },

    addTableCountry: async function (dbName) {

        var query = fs.readFileSync("sql-add-country.txt", 'utf8')
        query = query.replace(/DB_NAME/g, dbName);

        return Promise.resolve(query)
    },

    addTableCity: async function (dbName) {

        var query = fs.readFileSync("sql-add-city.txt", 'utf8')
        query = query.replace(/DB_NAME/g, dbName);

        return Promise.resolve(query)
    },

    addTablePort: async function (dbName) {

        var query = fs.readFileSync("sql-add-port.txt", 'utf8')
        query = query.replace(/DB_NAME/g, dbName);

        return Promise.resolve(query)
    },

    addTableData: async function (dbName) {

        var query = fs.readFileSync("sql-add-data.txt", 'utf8')
        query = query.replace(/DB_NAME/g, dbName);

        return Promise.resolve(query)
    },

    addTableRelation: async function (dbName) {

        var query = fs.readFileSync("sql-add-relation.txt", 'utf8')
        query = query.replace(/DB_NAME/g, dbName);

        return Promise.resolve(query)
    },

    createLogin: async function (username, password) {

        let query = "USE [master] CREATE LOGIN [" + username + "] WITH PASSWORD=N'" + password + "', DEFAULT_LANGUAGE=[us_english], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF DENY VIEW ANY DATABASE TO [" + username + "]";
        return Promise.resolve(query)
    },

    deleteLogin: async function (username) {

        let query = "USE [master] DROP LOGIN [" + username + "]"
        return Promise.resolve(query)
    },

    setLoginOnData: async function (username, dbName) {

        let query = "USE [" + dbName + "] EXEC dbo.sp_changedbowner @loginame = N'" + username + "', @map = false";
        return Promise.resolve(query)
    },

    deleteDB: async function (dbName) {

        let query = "USE [master] DROP DATABASE [" + dbName + "]";
        return Promise.resolve(query)
    }
}