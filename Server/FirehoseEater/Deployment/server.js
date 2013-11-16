var sql = require('mssql'); 
var http = require('http');


/*
var Connection = require('tedious').Connection;

  var config = {
    userName: 'tommy@z9cfcadmwg.database.windows.net',
    password: 'vovoLI11SS',
    server: 'z9cfcadmwg.database.windows.net',
	database: 'TidalMe',
	options:
	{
		database: 'TidalMe',
		//port: '1433',
		encrypt: true,
		debug : {
			//packet: true,
			//data: true,
			payload: true,
			token: true,
			log: true
		}
	},
}


function executeStatement() {
    request = new Request("select 42, 'hello world'", function(err, rowCount) {
      if (err) {
        console.log(err);
      } else {
        console.log(rowCount + ' rows');
      }
    });

    request.on('row', function(columns) {
      columns.forEach(function(column) {
        console.log(column.value);
      });
    });

    connection.execSql(request);
  }

  var connection = new Connection(config);
    connection.on('debug', function(text) {
    // If no error, then good to go...
      console.info(text);
    }
  );

  connection.on('connect', function(err) {
    // If no error, then good to go...
      console.info('connected' + err);
    }
  );
  */

config = {
    user: 'Tidal1@z9cfcadmwg.database.windows.net',
    password: 't1dalw4ve!',
    server: 'z9cfcadmwg.database.windows.net',
    database: 'TidalMe',
	options:{
		encrypt: true,
		database: 'TidalMe',
	}
}
console.info("starting");
var connection1 = new sql.Connection(config, function(err) {

	console.info("connected");

    // Query

    var request = new sql.Request(connection1); // or: var request = connection.request();
    request.query("insert Location (WoeId, Country, CountryCode, Name, ParentId, PlaceTypeCode, Url) Values(2, '', '', '', 12, 1, '')", function(err, recordset) {
        console.dir(recordset);
    });

    // Stored Procedure

    var request = new sql.Request(connection1);
    request.input('Date', sql.DateTime, new Date());
	request.input('HashTag', sql.NVarChar, '#Hash');
	request.input('Count', sql.Int, '10');
    request.execute('InsertRawTrendingData', function(err, recordsets, returnValue) {
		console.info(err);
        console.info(recordsets);
    });

});

	http.createServer(function(req, res) {
		//var x = new Twitter(null);
		//var y = Twitter.Create(null);
		res.write('Hello, world');
		res.end();
	}).listen(8000);