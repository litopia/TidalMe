(function() {
	'use strict';
	exports.SqlApi = exports.SqlApi || {};
	ss.initAssembly(exports, 'SqlApi');
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.SqlConfiguration
	var $SqlConfiguration = function() {
		this.user = null;
		this.password = null;
		this.server = null;
		this.options = null;
		this['debug.packet'] = false;
		this['debug.data'] = false;
		this['debug.payload'] = false;
	};
	$SqlConfiguration.__typeName = 'SqlConfiguration';
	exports.SqlConfiguration = $SqlConfiguration;
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.Options
	var $SqlApi_Options = function() {
		this.encrypt = false;
		this.database = null;
	};
	$SqlApi_Options.__typeName = 'SqlApi.Options';
	exports.SqlApi.Options = $SqlApi_Options;
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.SqlServerFactory
	var $SqlApi_SqlServerFactory = function() {
	};
	$SqlApi_SqlServerFactory.__typeName = 'SqlApi.SqlServerFactory';
	$SqlApi_SqlServerFactory.get_instance = function() {
		return $SqlApi_SqlServerFactory.$m_Singleton.value();
	};
	exports.SqlApi.SqlServerFactory = $SqlApi_SqlServerFactory;
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.SqlUtils
	var $SqlApi_SqlUtils = function() {
	};
	$SqlApi_SqlUtils.__typeName = 'SqlApi.SqlUtils';
	$SqlApi_SqlUtils.getSqlConnection = function() {
		var $state = 0, $tcs = new ss.TaskCompletionSource(), tcs, sql, $t1, $t2, config, connection;
		var $sm = function() {
			try {
				$sm1:
				for (;;) {
					switch ($state) {
						case 0: {
							$state = -1;
							tcs = new ss.TaskCompletionSource();
							sql = $SqlApi_SqlServerFactory.get_instance();
							//const string connStr = "Driver={SQL Server Native Client 10.0};Server=tcp:z9cfcadmwg.database.windows.net,1433;Database=TidalMe;Uid=tommy@z9cfcadmwg;Pwd={your_password_here};Encrypt=yes;Connection Timeout=30;";
							$t1 = new $SqlConfiguration();
							$t1.user = 'Tidal1@z9cfcadmwg.database.windows.net';
							$t1.password = 't1dalw4ve!';
							$t1.server = 'z9cfcadmwg.database.windows.net';
							$t2 = new $SqlApi_Options();
							$t2.encrypt = true;
							$t2.database = 'TidalMe';
							$t1.options = $t2;
							config = $t1;
							connection = null;
							connection = new sql.Connection(config, function(err) {
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
	exports.SqlApi.SqlUtils = $SqlApi_SqlUtils;
	ss.initClass($SqlConfiguration, exports, {});
	ss.initClass($SqlApi_Options, exports, {});
	ss.initClass($SqlApi_SqlServerFactory, exports, {});
	ss.initClass($SqlApi_SqlUtils, exports, {});
	$SqlApi_SqlServerFactory.$m_Singleton = new ss.Lazy(function() {
		return require('mssql');
	});
})();
