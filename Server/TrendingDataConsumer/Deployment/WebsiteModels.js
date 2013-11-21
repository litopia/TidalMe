'use strict';
require('mscorlib');
var SqlApi = require('SqlApi');
exports.WebsiteModels = exports.WebsiteModels || {};
ss.initAssembly(exports, 'WebsiteModels');
////////////////////////////////////////////////////////////////////////////////
// WebsiteModels.TwitterTrendingDataModel
var $WebsiteModels_TwitterTrendingDataModel = function() {
};
$WebsiteModels_TwitterTrendingDataModel.__typeName = 'WebsiteModels.TwitterTrendingDataModel';
$WebsiteModels_TwitterTrendingDataModel.$initialize = function() {
	var $state = 0, $t1;
	var $sm = function() {
		$sm1:
		for (;;) {
			switch ($state) {
				case 0: {
					$state = -1;
					console.log('Initialize');
					$t1 = $WebsiteModels_TwitterTrendingDataModel.$getSqlConnection();
					$state = 1;
					$t1.continueWith($sm);
					return;
				}
				case 1: {
					$state = -1;
					$WebsiteModels_TwitterTrendingDataModel.$m_Connection = $t1.getResult();
					$state = -1;
					break $sm1;
				}
				default: {
					break $sm1;
				}
			}
		}
	};
	$sm();
};
$WebsiteModels_TwitterTrendingDataModel.getInstance = function() {
	console.log('Getting instance');
	return new $WebsiteModels_TwitterTrendingDataModel();
};
$WebsiteModels_TwitterTrendingDataModel.$getSqlConnection = function() {
	var $state = 0, $tcs = new ss.TaskCompletionSource(), tcs, sql, $t1, $t2, config, connection;
	var $sm = function() {
		try {
			$sm1:
			for (;;) {
				switch ($state) {
					case 0: {
						$state = -1;
						console.log('Getting Connection start');
						tcs = new ss.TaskCompletionSource();
						sql = SqlApi.SqlApi.SqlServerFactory.get_instance();
						//const string connStr = "Driver={SQL Server Native Client 10.0};Server=tcp:z9cfcadmwg.database.windows.net,1433;Database=TidalMe;Uid=tommy@z9cfcadmwg;Pwd={your_password_here};Encrypt=yes;Connection Timeout=30;";
						$t1 = new SqlApi.SqlConfiguration();
						$t1.user = 'Tidal1@z9cfcadmwg.database.windows.net';
						$t1.password = 't1dalw4ve!';
						$t1.server = 'z9cfcadmwg.database.windows.net';
						$t2 = new SqlApi.SqlApi.Options();
						$t2.encrypt = true;
						$t2.database = 'TidalMe';
						$t1.options = $t2;
						config = $t1;
						console.log('Getting Connection to sql');
						connection = null;
						connection = new sql.Connection(config, function(err) {
							console.log('Connection received from sql, err: ' + err);
							if (!ss.isNullOrUndefined(err)) {
								tcs.setException(new ss.Exception('Error Received: ' + err));
								return;
							}
							tcs.setResult(err);
						});
						$state = 1;
						tcs.task.continueWith($sm);
						return;
					}
					case 1: {
						$state = -1;
						tcs.task.getResult();
						$tcs.setResult(connection);
						return;
					}
					default: {
						break $sm1;
					}
				}
			}
		}
		catch ($t3) {
			$tcs.setException(ss.Exception.wrap($t3));
		}
	};
	$sm();
	return $tcs.task;
};
exports.WebsiteModels.TwitterTrendingDataModel = $WebsiteModels_TwitterTrendingDataModel;
ss.initClass($WebsiteModels_TwitterTrendingDataModel, exports, {
	getLocations: function(callback) {
		if (ss.isNullOrUndefined($WebsiteModels_TwitterTrendingDataModel.$m_Connection)) {
			return;
		}
		var request = $WebsiteModels_TwitterTrendingDataModel.$m_Connection.request();
		request.query(ss.formatString('SELECT WoeId, Name\r\nFROM Location\r\nWHERE PlaceTypeCode = 12 OR PlaceTypeCode = 19\r\nORDER BY Name'), function(err, recordsets) {
			if (!ss.isNullOrUndefined(err)) {
				console.info('err = ' + err);
				callback(null);
			}
			else {
				callback(recordsets);
			}
		});
	},
	getData: function(callback, woeId) {
		if (ss.isNullOrUndefined($WebsiteModels_TwitterTrendingDataModel.$m_Connection)) {
			return;
		}
		var request = $WebsiteModels_TwitterTrendingDataModel.$m_Connection.request();
		request.query(ss.formatString('select top 10 Name, count(*) as Score from TwtrTrendingData\r\nWHERE WoeId = {0}\r\nGROUP BY Name\r\nORDER BY count(*) desc', woeId), function(err, recordsets) {
			if (!ss.isNullOrUndefined(err)) {
				console.info('err = ' + err);
				callback(null);
			}
			else {
				callback(recordsets);
			}
		});
	}
});
$WebsiteModels_TwitterTrendingDataModel.$m_Connection = null;
$WebsiteModels_TwitterTrendingDataModel.$initialize();
