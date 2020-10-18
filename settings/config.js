"use strict";

var config = {
    "development": {
        "db_server": {
            "database": "jupita",
            "host": "mongodb://localhost:27017/jupita"
        },
        "auth": {
            "secret": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
            "tokenPeriod": 1440
        },
        "web_server": {
            "url": "http://localhost:3000",
            "port": 3000
        }
    },
    "production": {
        "db_server": {
            "database": "jupita",
            "host": "mongodb://localhost:27017/jupita"
        },
        "auth": {
            "secret": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
            "tokenPeriod": 1440
        },
        "web_server": {
            "url": "http://ec2-18-191-168-3.us-east-2.compute.amazonaws.com:3000",
            "port": 3000
        }
    }
};

// var node_env = process.env.NODE_ENV || 'development';
 var node_env = process.env.NODE_ENV || 'production';

module.exports = config[node_env];