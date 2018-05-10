var mysql     = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  database : 'uaic_esims',
  user     : 'root',
  password: 'root'
});

connection.connect();

module.exports = connection;