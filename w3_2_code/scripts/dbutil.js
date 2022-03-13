let mysql = require('mysql');

function createConnection(){
    let connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database: 'erc_test',
        port: 3306
    });
    return connection;
}

module.exports.createConnection=createConnection;