'use strict';

var mysql = require('mysql')

var databaseConfig = {
    user: 'tparty',
    password: 'Test1234!',
    host: 'den1.mysql6.gear.host',
    database: 'tparty'
};

module.exports = {
    init: function (next) {
        var sqlConnection = mysql.createConnection(databaseConfig)
        sqlConnection.connect(function(err) {
            if(err)
            {
                console.error('Error connecting ' + err.stack);
                setTimeout(init((err, val)=>{}), 2000);
            }
            else
                next(null, sqlConnection);
        });

        sqlConnection.on('error', function(err){
            if(err.code == 'PROTOCOL_CONNECTION_LOST'){
                init((err, val)=>{});
            }
            else
                next(err)
        })
    },

    query: function (sqlConnection, sqlQuery, next) {
        sqlConnection.query(sqlQuery, function(error, rows) {
            if(error)
                next(error)

            next(null, rows)
        });
    }
}