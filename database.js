'use strict';

var express = require('express')
var app = express()
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
                next(err);
            }
            else
                next(null, sqlConnection);
        });
    },

    query: function (sqlConnection, sqlQuery, next) {
        sqlConnection.query(sqlQuery, function(error, rows) {
            if(error)
                next(error)

            next(null, rows)
        });
    }
}