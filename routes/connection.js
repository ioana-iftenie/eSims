var mysql     = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  database : 'uaic_esims',
  user     : 'root',
  password: 'root',
  multipleStatements: true
});

connection.connect();

module.exports = connection;