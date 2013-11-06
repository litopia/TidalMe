(function() {
	'use strict';
	var $asm = {};
	global.TwitterApiSalty = global.TwitterApiSalty || {};
	ss.initAssembly($asm, 'FirehoseEater');
	////////////////////////////////////////////////////////////////////////////////
	// Program
	var $$Program = function() {
	};
	$$Program.__typeName = '$Program';
	$$Program.$main = function() {
		var $state = 0, $t1;
		var $sm = function() {
			$sm1:
			for (;;) {
				switch ($state) {
					case 0: {
						$state = -1;
						$$Program.$loadFiles();
						$t1 = $$Program.$getSqlConnection();
						$state = 1;
						$t1.continueWith($sm);
						return;
					}
					case 1: {
						$state = -1;
						$$Program.$m_Connection = $t1.getResult();
						$FirehoseEater_$TwitterFirehose.get_$instance().add_$newTweets($$Program.$instance_NewTweets);
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
	$$Program.$loadFiles = function() {
		require('./linq.js');
		//FileLoader.GetSql();
	};
	$$Program.$getSqlConnection = function() {
		var $state = 0, $tcs = new ss.TaskCompletionSource(), tcs, sql, $t1, $t2, config, connection;
		var $sm = function() {
			try {
				$sm1:
				for (;;) {
					switch ($state) {
						case 0: {
							$state = -1;
							tcs = new ss.TaskCompletionSource();
							sql = require('mssql');
							//const string connStr = "Driver={SQL Server Native Client 10.0};Server=tcp:z9cfcadmwg.database.windows.net,1433;Database=TidalMe;Uid=tommy@z9cfcadmwg;Pwd={your_password_here};Encrypt=yes;Connection Timeout=30;";
							$t1 = new $SqlConfiguration();
							$t1.user = 'Tidal1@z9cfcadmwg.database.windows.net';
							$t1.password = 't1dalw4ve!';
							$t1.server = 'z9cfcadmwg.database.windows.net';
							$t2 = new $TwitterApiSalty_Options();
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
								//var request = connection.Request();
								//request.Query("select 1 as number", delegate(object error, object recordSet) {
								//    Console.Info(Json.Stringify(recordSet));
								//});
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
	$$Program.$instance_NewTweets = function(arg) {
	};
	////////////////////////////////////////////////////////////////////////////////
	// TwitterApiSalty.SqlConfiguration
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
	global.SqlConfiguration = $SqlConfiguration;
	////////////////////////////////////////////////////////////////////////////////
	// FirehoseEater.FileLoader
	var $FirehoseEater_$FileLoader = function() {
	};
	$FirehoseEater_$FileLoader.__typeName = 'FirehoseEater.$FileLoader';
	////////////////////////////////////////////////////////////////////////////////
	// FirehoseEater.TwitterFirehose
	var $FirehoseEater_$TwitterFirehose = function() {
		this.$1$NewTweetsField = null;
		this.$m_TwitterObj = null;
		var twitter = require('twitter');
		var $t1 = new $TwitterApiSalty_Credentials();
		$t1.consumer_key = '5iaBY1vY49ngNJBMy0vw';
		$t1.consumer_secret = 'bBx36uscbcaY0h7kX9HktfVzty7Vyb7n0FJcEgw8';
		$t1.access_token_key = '325955870-uePDCtgtivjrOyUnTORwGOXpRlBn3rCC1xAeDOcB';
		$t1.access_token_secret = 'Emv6SBI8Yevn5MhiBIsjvJ8Ub5G6lOrU3UylRUoqMgaev';
		var creds = $t1;
		this.$m_TwitterObj = new twitter(creds);
		//string fileName = "Temp.csv";
		//string dataFileName = "TempData.csv";
		//JsDictionary<string, object> options = new JsDictionary<string, object>();
		//options["include-entities"] = true;
		//twit.Get("/statuses/show/27593302936.json", options, delegate(object data)
		//{
		//    Console.Info(Json.Stringify(data));
		//});
		//FS.WriteFileSync(fileName, "{");
		var totalTweets = 0;
		var hashTags = new (ss.makeGenericType(ss.Dictionary$2, [String, ss.Int32]))();
		var beginningTime = new Date();
		var hashTagMatcher = new RegExp('[\\W](#\\w+)', 'g');
		this.$m_TwitterObj.stream('statuses/sample', ss.mkdel(this, function(stream) {
			stream.on('data', ss.mkdel(this, function(data) {
				var dataDict = data;
				if (ss.keyExists(dataDict, 'delete')) {
					// Ignore deletes
					return;
				}
				if (!ss.staticEquals(this.$1$NewTweetsField, null)) {
					this.$1$NewTweetsField(data);
				}
				//FS.AppendFile(dataFileName, Json.Stringify(data));
				//Console.Info(Json.Stringify(data));
				//if ((DateTime.Now - beginningTime) < 60 * 1000)
				//{
				//    NodeJS.Console.Info("Tweet");
				//    totalTweets++;
				//    string text = (string)dataDict["text"];
				//    var matches = (" " + text).Match(hashTagMatcher);
				//    if (matches == null || matches.Length == 0)
				//    {
				//        return;
				//    }
				//    foreach (string match in matches)
				//    {
				//        string hashTag = match.Substring(1);
				//        if (!hashTags.ContainsKey(hashTag))
				//        {
				//            hashTags[hashTag] = 0;
				//        }
				//        hashTags[hashTag]++;
				//    }
				//    //FS.AppendFileSync(fileName, Json.Stringify(data) + ",");
				//}
				//else
				//{
				//    NodeJS.Console.Info(String.Format("Begin: {0}, End: {1}; Total: {2}", beginningTime, DateTime.Now, totalTweets));
				//    string concated = String.Join("\r\n", hashTags.OrderByDescending(m => m.Value).Select(m => m.Key + "," + m.Value));
				//    FS.WriteFileSync(fileName, concated);
				//    throw new Exception();
				//}
			}));
		}));
	};
	$FirehoseEater_$TwitterFirehose.__typeName = 'FirehoseEater.$TwitterFirehose';
	$FirehoseEater_$TwitterFirehose.get_$instance = function() {
		return $FirehoseEater_$TwitterFirehose.$m_Singleton.value();
	};
	////////////////////////////////////////////////////////////////////////////////
	// FirehoseEater.TwitterFirehoseAggregator
	var $FirehoseEater_$TwitterFirehoseAggregator = function() {
		this.$m_Dict = new (ss.makeGenericType(ss.Dictionary$2, [Date, ss.makeGenericType(ss.Dictionary$2, [String, ss.Int32])]))();
		$FirehoseEater_$TwitterFirehose.get_$instance().add_$newTweets(ss.mkdel(this, this.$instance_NewTweets));
	};
	$FirehoseEater_$TwitterFirehoseAggregator.__typeName = 'FirehoseEater.$TwitterFirehoseAggregator';
	$FirehoseEater_$TwitterFirehoseAggregator.get_$instance = function() {
		return $FirehoseEater_$TwitterFirehoseAggregator.$m_Singleton.value();
	};
	////////////////////////////////////////////////////////////////////////////////
	// TwitterApiSalty.Credentials
	var $TwitterApiSalty_Credentials = function() {
		this.consumer_key = null;
		this.consumer_secret = null;
		this.access_token_key = null;
		this.access_token_secret = null;
	};
	$TwitterApiSalty_Credentials.__typeName = 'TwitterApiSalty.Credentials';
	global.TwitterApiSalty.Credentials = $TwitterApiSalty_Credentials;
	////////////////////////////////////////////////////////////////////////////////
	// TwitterApiSalty.Options
	var $TwitterApiSalty_Options = function() {
		this.encrypt = false;
		this.database = null;
	};
	$TwitterApiSalty_Options.__typeName = 'TwitterApiSalty.Options';
	global.TwitterApiSalty.Options = $TwitterApiSalty_Options;
	////////////////////////////////////////////////////////////////////////////////
	// TwitterApiSalty.SqlServerFactory
	var $TwitterApiSalty_SqlServerFactory = function() {
	};
	$TwitterApiSalty_SqlServerFactory.__typeName = 'TwitterApiSalty.SqlServerFactory';
	global.TwitterApiSalty.SqlServerFactory = $TwitterApiSalty_SqlServerFactory;
	////////////////////////////////////////////////////////////////////////////////
	// TwitterApiSalty.SqlTypes
	var $TwitterApiSalty_SqlTypes = function() {
	};
	$TwitterApiSalty_SqlTypes.__typeName = 'TwitterApiSalty.SqlTypes';
	global.TwitterApiSalty.SqlTypes = $TwitterApiSalty_SqlTypes;
	////////////////////////////////////////////////////////////////////////////////
	// TwitterApiSalty.TwitterFactory
	var $TwitterApiSalty_TwitterFactory = function() {
	};
	$TwitterApiSalty_TwitterFactory.__typeName = 'TwitterApiSalty.TwitterFactory';
	global.TwitterApiSalty.TwitterFactory = $TwitterApiSalty_TwitterFactory;
	ss.initClass($$Program, $asm, {});
	ss.initClass($SqlConfiguration, $asm, {});
	ss.initClass($FirehoseEater_$FileLoader, $asm, {});
	ss.initClass($FirehoseEater_$TwitterFirehose, $asm, {
		add_$newTweets: function(value) {
			this.$1$NewTweetsField = ss.delegateCombine(this.$1$NewTweetsField, value);
		},
		remove_$newTweets: function(value) {
			this.$1$NewTweetsField = ss.delegateRemove(this.$1$NewTweetsField, value);
		}
	});
	ss.initClass($FirehoseEater_$TwitterFirehoseAggregator, $asm, {
		$instance_NewTweets: function(arg) {
			var src = ss.utcNow();
			var hm = new Date(src.getFullYear(), src.getMonth() + 1 - 1, src.getDate(), src.getHours(), src.getMinutes(), 0);
		}
	});
	ss.initClass($TwitterApiSalty_Credentials, $asm, {});
	ss.initClass($TwitterApiSalty_Options, $asm, {});
	ss.initClass($TwitterApiSalty_SqlServerFactory, $asm, {});
	ss.initEnum($TwitterApiSalty_SqlTypes, $asm, { int$1: 'sql.Int' }, true);
	ss.initClass($TwitterApiSalty_TwitterFactory, $asm, {});
	$FirehoseEater_$TwitterFirehose.$m_Singleton = new ss.Lazy(function() {
		return $FirehoseEater_$TwitterFirehose.createInstance();
	});
	$$Program.$m_Connection = null;
	$$Program.$main();
	$FirehoseEater_$TwitterFirehoseAggregator.$m_Singleton = new ss.Lazy(function() {
		return $FirehoseEater_$TwitterFirehoseAggregator.createInstance();
	});
})();
