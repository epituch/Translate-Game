'use strict';

var express = require('express')
var app = express()
var mysql = require('mysql')

var databaseConfig = {
    user: 'root',
    password: 'daBoiRego7',
    server: '127.0.0.1',
    database: 'TParty',
    port: 3306
};

module.exports = {
    init: function (next) {
        var sqlConnection = mysql.createConnection(databaseConfig)
        sqlConnection.connect(function(err) {
            if(err)
            {
                console.error('Error connecting ' + err.stack);
                next(err);
            }
            else
                next(null, sqlConnection);
        });
    },

    query: function (sqlConnection, sqlQuery, next) {
        sqlConnection.query(sqlQuery, function(error, rows) {
            if(err)
                next(err)

            next(null, rows)
        });
    }
}