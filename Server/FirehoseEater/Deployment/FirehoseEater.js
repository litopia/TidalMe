'use strict';
require('mscorlib');
var http = require('http');
exports.FirehoseEater = exports.FirehoseEater || {};
exports.TwitterApiSalty = exports.TwitterApiSalty || {};
ss.initAssembly(exports, 'FirehoseEater');
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
					setInterval($$Program.$processTweetData, 50000);
					// Every 50s
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
						sql = $TwitterApiSalty_SqlServerFactory.get_instance();
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
$$Program.$processTweetData = function() {
	var aggregation = $FirehoseEater_$TwitterFirehoseAggregator.get_$instance().$getAvailableAggregation();
	if (ss.isNullOrUndefined(aggregation)) {
		return;
	}
	console.info('**************************************Sending *****');
	var $t1 = aggregation.value.getEnumerator();
	try {
		while ($t1.moveNext()) {
			var valKVP = $t1.current();
			var request = $$Program.$m_Connection.request();
			request.input('Date', $TwitterApiSalty_SqlServerFactory.get_instance().DateTime, aggregation.key);
			request.input('HashTag', $TwitterApiSalty_SqlServerFactory.get_instance().NVarChar, valKVP.key);
			request.input('Count', $TwitterApiSalty_SqlServerFactory.get_instance().Int, valKVP.value);
			request.execute('InsertRawTrendingData', function(err, recordsets, returnValue) {
				if (!ss.isNullOrUndefined(err)) {
					console.info('err = ' + err);
				}
			});
		}
	}
	finally {
		$t1.dispose();
	}
	$FirehoseEater_$TwitterFirehoseAggregator.get_$instance().$deleteAggregateForMinute(aggregation.key);
};
$$Program.$dummy = function() {
	http.createServer(function(req, res) {
		res.write('Hello, world');
		res.end();
	}).listen(8000);
};
////////////////////////////////////////////////////////////////////////////////
// TestProgram
var $$TestProgram = function() {
};
$$TestProgram.__typeName = '$TestProgram';
$$TestProgram.$runTests = function() {
	var $state = 0, $t1;
	var $sm = function() {
		$sm1:
		for (;;) {
			switch ($state) {
				case 0: {
					$state = -1;
					console.info(ss.formatString('Test1: {0}', $$TestProgram.$test1()));
					console.info(ss.formatString('Test2: {0}', $$TestProgram.$test2()));
					$t1 = $$TestProgram.$test3();
					$state = 1;
					$t1.continueWith($sm);
					return;
				}
				case 1: {
					$state = -1;
					console.info(ss.formatString('Test3: {0}', $t1.getResult()));
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
$$TestProgram.$test1 = function() {
	var matches = $FirehoseEater_$TwitterFirehoseAggregator.$getMatches('#4YearsOfAPKGK love love love &lt;3 http://t.co/IDCRjXanvg');
	if (ss.isNullOrUndefined(matches) && matches.length !== 1) {
		return false;
	}
	return matches[0] === ' #4YearsOfAPKGK';
};
$$TestProgram.$test2 = function() {
	var firehose = $$TestTwitterFirehose.get_$instance();
	var aggregator = $FirehoseEater_$TwitterFirehoseAggregator.$getTestInstance(firehose);
	var $t1 = new $TwitterApiSalty_Tweet();
	$t1.tidalServerDate = ss.utcNow();
	$t1.lang = 'en';
	$t1.text = '#123 hello world';
	firehose.$triggerNewTweets($t1);
	if (ss.isValue(aggregator.$getAvailableAggregation())) {
		return false;
	}
	var $t2 = new $TwitterApiSalty_Tweet();
	$t2.tidalServerDate = ss.today();
	$t2.lang = 'en';
	$t2.text = '#234 bye bye';
	firehose.$triggerNewTweets($t2);
	var returnVal = aggregator.$getAvailableAggregation();
	if (!(ss.staticEquals(returnVal.key, ss.today()) && returnVal.value.get_count() === 1 && Enumerable.from(returnVal.value).first().key === '#234' && Enumerable.from(returnVal.value).first().value === 1)) {
		return false;
	}
	var $t3 = new $TwitterApiSalty_Tweet();
	$t3.tidalServerDate = ss.today();
	$t3.lang = 'en';
	$t3.text = 'hi #234 hi #234';
	firehose.$triggerNewTweets($t3);
	var returnVal2 = aggregator.$getAvailableAggregation();
	if (!(ss.staticEquals(returnVal2.key, ss.today()) && returnVal2.value.get_count() === 1 && Enumerable.from(returnVal2.value).first().key === '#234' && Enumerable.from(returnVal2.value).first().value === 3)) {
		return false;
	}
	aggregator.$deleteAggregateForMinute(ss.today());
	if (ss.isValue(aggregator.$getAvailableAggregation())) {
		return false;
	}
	aggregator.$reset();
	return true;
};
$$TestProgram.$test3 = function() {
	var $state = 0, $tcs = new ss.TaskCompletionSource(), $t1, conn, tcs, $t2, date, request, tcs1a, $t3, date1a, request1a, tcs2, request2, tcs3, request3;
	var $sm = function() {
		try {
			$sm1:
			for (;;) {
				switch ($state) {
					case 0: {
						$state = -1;
						$t1 = $$Program.$getSqlConnection();
						$state = 1;
						$t1.continueWith($sm);
						return;
					}
					case 1: {
						$state = -1;
						conn = $t1.getResult();
						tcs = new ss.TaskCompletionSource();
						$t2 = ss.utcNow();
						date = new Date($t2.getFullYear() + 100, $t2.getMonth(), $t2.getDate(), $t2.getHours(), $t2.getMinutes(), $t2.getSeconds(), $t2.getMilliseconds());
						request = conn.request();
						request.input('Date', $TwitterApiSalty_SqlServerFactory.get_instance().DateTime, date);
						request.input('HashTag', $TwitterApiSalty_SqlServerFactory.get_instance().NVarChar, '#HELLOWORLD');
						request.input('Count', $TwitterApiSalty_SqlServerFactory.get_instance().Int, 50);
						request.execute('InsertRawTrendingData', function(err, recordsets, returnValue) {
							if (!ss.isNullOrUndefined(err)) {
								console.info('err = ' + err);
							}
							tcs.setResult(true);
						});
						$state = 2;
						tcs.task.continueWith($sm);
						return;
					}
					case 2: {
						$state = -1;
						tcs.task.getResult();
						tcs1a = new ss.TaskCompletionSource();
						$t3 = ss.utcNow();
						date1a = new Date($t3.getFullYear() + 101, $t3.getMonth(), $t3.getDate(), $t3.getHours(), $t3.getMinutes(), $t3.getSeconds(), $t3.getMilliseconds());
						request1a = conn.request();
						request1a.input('Date', $TwitterApiSalty_SqlServerFactory.get_instance().DateTime, date1a);
						request1a.input('HashTag', $TwitterApiSalty_SqlServerFactory.get_instance().NVarChar, '#HELLOWORLD');
						request1a.input('Count', $TwitterApiSalty_SqlServerFactory.get_instance().Int, 50);
						request1a.execute('InsertRawTrendingData', function(err1, recordsets1, returnValue1) {
							if (!ss.isNullOrUndefined(err1)) {
								console.info('err = ' + err1);
							}
							tcs1a.setResult(true);
						});
						$state = 3;
						tcs1a.task.continueWith($sm);
						return;
					}
					case 3: {
						$state = -1;
						tcs1a.task.getResult();
						tcs2 = new ss.TaskCompletionSource();
						request2 = conn.request();
						request2.query(ss.formatString("select * from TrendingData where HashTag = '{0}' AND Count = {1}", '#HELLOWORLD', 50), function(err2, recordSet) {
							if (!ss.isNullOrUndefined(err2)) {
								console.info('err = ' + err2);
							}
							tcs2.setResult(recordSet.length === 2);
						});
						$state = 4;
						tcs2.task.continueWith($sm);
						return;
					}
					case 4: {
						$state = -1;
						if (!tcs2.task.getResult()) {
							$tcs.setResult(false);
							return;
						}
						tcs3 = new ss.TaskCompletionSource();
						request3 = conn.request();
						request3.query(ss.formatString("delete from TrendingData where HashTag = '{0}' AND Count = {1}", '#HELLOWORLD', 50), function(err3, recordSet1) {
							if (!ss.isNullOrUndefined(err3)) {
								console.info('err = ' + err3);
							}
							tcs3.setResult(true);
						});
						$tcs.setResult(true);
						return;
					}
					default: {
						break $sm1;
					}
				}
			}
		}
		catch ($t4) {
			$tcs.setException(ss.Exception.wrap($t4));
		}
	};
	$sm();
	return $tcs.task;
};
////////////////////////////////////////////////////////////////////////////////
// TestTwitterFirehose
var $$TestTwitterFirehose = function() {
	this.$1$NewTweetsField = null;
};
$$TestTwitterFirehose.__typeName = '$TestTwitterFirehose';
$$TestTwitterFirehose.get_$instance = function() {
	return $$TestTwitterFirehose.$m_Singleton.value();
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
exports.SqlConfiguration = $SqlConfiguration;
////////////////////////////////////////////////////////////////////////////////
// FirehoseEater.FileLoader
var $FirehoseEater_$FileLoader = function() {
};
$FirehoseEater_$FileLoader.__typeName = 'FirehoseEater.$FileLoader';
////////////////////////////////////////////////////////////////////////////////
// FirehoseEater.SaltyUtils
var $FirehoseEater_$SaltyUtils = function() {
};
$FirehoseEater_$SaltyUtils.__typeName = 'FirehoseEater.$SaltyUtils';
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
	var hashTags = new (ss.makeGenericType(ss.Dictionary$2, [String, ss.Int32]))();
	var beginningTime = new Date();
	this.$m_TwitterObj.stream('statuses/sample', ss.mkdel(this, function(stream) {
		stream.on('data', ss.mkdel(this, function(data) {
			var dataDict = data;
			if (ss.keyExists(dataDict, 'delete')) {
				// Ignore deletes
				return;
			}
			var tweet = data;
			if (tweet.lang !== 'en') {
				// Only accept english for now
				return;
			}
			tweet.tidalServerDate = ss.utcNow();
			if (!ss.staticEquals(this.$1$NewTweetsField, null)) {
				this.$1$NewTweetsField(tweet);
			}
		}));
	}));
};
$FirehoseEater_$TwitterFirehose.__typeName = 'FirehoseEater.$TwitterFirehose';
$FirehoseEater_$TwitterFirehose.get_$instance = function() {
	return $FirehoseEater_$TwitterFirehose.$m_Singleton.value();
};
////////////////////////////////////////////////////////////////////////////////
// FirehoseEater.TwitterFirehoseAggregator
var $FirehoseEater_$TwitterFirehoseAggregator = function(firehose) {
	this.$m_Dict = new (ss.makeGenericType(ss.Dictionary$2, [Date, ss.makeGenericType(ss.Dictionary$2, [String, ss.Int32])]))();
	firehose.add_newTweets(ss.mkdel(this, this.$twitterFirehoseNewTweets));
};
$FirehoseEater_$TwitterFirehoseAggregator.__typeName = 'FirehoseEater.$TwitterFirehoseAggregator';
$FirehoseEater_$TwitterFirehoseAggregator.get_$instance = function() {
	return $FirehoseEater_$TwitterFirehoseAggregator.$m_Singleton.value();
};
$FirehoseEater_$TwitterFirehoseAggregator.$getTestInstance = function(firehose) {
	return new $FirehoseEater_$TwitterFirehoseAggregator(firehose);
};
$FirehoseEater_$TwitterFirehoseAggregator.$getMatches = function(text) {
	return (' ' + text).match($FirehoseEater_$TwitterFirehoseAggregator.$s_HashTagMatcher);
};
////////////////////////////////////////////////////////////////////////////////
// FirehoseEater.DictionaryExtensions
var $FirehoseEater_DictionaryExtensions = function() {
};
$FirehoseEater_DictionaryExtensions.__typeName = 'FirehoseEater.DictionaryExtensions';
$FirehoseEater_DictionaryExtensions.getOrConstruct = function(Key, Value) {
	return function(dict, key) {
		if (dict.containsKey(key)) {
			return dict.get_item(key);
		}
		var val = ss.createInstance(Value);
		dict.set_item(key, val);
		return dict.get_item(key);
	};
};
exports.FirehoseEater.DictionaryExtensions = $FirehoseEater_DictionaryExtensions;
////////////////////////////////////////////////////////////////////////////////
// FirehoseEater.ITwitterFirehose
var $FirehoseEater_ITwitterFirehose = function() {
};
$FirehoseEater_ITwitterFirehose.__typeName = 'FirehoseEater.ITwitterFirehose';
exports.FirehoseEater.ITwitterFirehose = $FirehoseEater_ITwitterFirehose;
////////////////////////////////////////////////////////////////////////////////
// TwitterApiSalty.Credentials
var $TwitterApiSalty_Credentials = function() {
	this.consumer_key = null;
	this.consumer_secret = null;
	this.access_token_key = null;
	this.access_token_secret = null;
};
$TwitterApiSalty_Credentials.__typeName = 'TwitterApiSalty.Credentials';
exports.TwitterApiSalty.Credentials = $TwitterApiSalty_Credentials;
////////////////////////////////////////////////////////////////////////////////
// TwitterApiSalty.Options
var $TwitterApiSalty_Options = function() {
	this.encrypt = false;
	this.database = null;
};
$TwitterApiSalty_Options.__typeName = 'TwitterApiSalty.Options';
exports.TwitterApiSalty.Options = $TwitterApiSalty_Options;
////////////////////////////////////////////////////////////////////////////////
// TwitterApiSalty.SqlServerFactory
var $TwitterApiSalty_SqlServerFactory = function() {
};
$TwitterApiSalty_SqlServerFactory.__typeName = 'TwitterApiSalty.SqlServerFactory';
$TwitterApiSalty_SqlServerFactory.get_instance = function() {
	return $TwitterApiSalty_SqlServerFactory.$m_Singleton.value();
};
exports.TwitterApiSalty.SqlServerFactory = $TwitterApiSalty_SqlServerFactory;
////////////////////////////////////////////////////////////////////////////////
// TwitterApiSalty.Tweet
var $TwitterApiSalty_Tweet = function() {
	this.created_at = new Date(0);
	this.tidalServerDate = new Date(0);
	this.text = null;
	this.lang = null;
};
$TwitterApiSalty_Tweet.__typeName = 'TwitterApiSalty.Tweet';
exports.TwitterApiSalty.Tweet = $TwitterApiSalty_Tweet;
////////////////////////////////////////////////////////////////////////////////
// TwitterApiSalty.TwitterFactory
var $TwitterApiSalty_TwitterFactory = function() {
};
$TwitterApiSalty_TwitterFactory.__typeName = 'TwitterApiSalty.TwitterFactory';
exports.TwitterApiSalty.TwitterFactory = $TwitterApiSalty_TwitterFactory;
ss.initClass($$Program, exports, {});
ss.initClass($$TestProgram, exports, {});
ss.initInterface($FirehoseEater_ITwitterFirehose, exports, { add_newTweets: null, remove_newTweets: null });
ss.initClass($$TestTwitterFirehose, exports, {
	add_newTweets: function(value) {
		this.$1$NewTweetsField = ss.delegateCombine(this.$1$NewTweetsField, value);
	},
	remove_newTweets: function(value) {
		this.$1$NewTweetsField = ss.delegateRemove(this.$1$NewTweetsField, value);
	},
	$triggerNewTweets: function(tweet) {
		this.$1$NewTweetsField(tweet);
	}
}, null, [$FirehoseEater_ITwitterFirehose]);
ss.initClass($SqlConfiguration, exports, {});
ss.initClass($FirehoseEater_$FileLoader, exports, {});
ss.initClass($FirehoseEater_$SaltyUtils, exports, {});
ss.initClass($FirehoseEater_$TwitterFirehose, exports, {
	add_newTweets: function(value) {
		this.$1$NewTweetsField = ss.delegateCombine(this.$1$NewTweetsField, value);
	},
	remove_newTweets: function(value) {
		this.$1$NewTweetsField = ss.delegateRemove(this.$1$NewTweetsField, value);
	}
}, null, [$FirehoseEater_ITwitterFirehose]);
ss.initClass($FirehoseEater_$TwitterFirehoseAggregator, exports, {
	$twitterFirehoseNewTweets: function(tweet) {
		var src = tweet.tidalServerDate;
		var utcNowInMinute = new Date(src.getFullYear(), src.getMonth() + 1 - 1, src.getDate(), src.getHours(), src.getMinutes(), 0);
		var matches = $FirehoseEater_$TwitterFirehoseAggregator.$getMatches(' ' + tweet.text);
		if (ss.isNullOrUndefined(matches) || matches.length === 0) {
			return;
		}
		for (var $t1 = 0; $t1 < matches.length; $t1++) {
			var match = matches[$t1];
			var hashTag = match.substring(1);
			$FirehoseEater_DictionaryExtensions.getOrConstruct(String, ss.Int32).call(null, $FirehoseEater_DictionaryExtensions.getOrConstruct(Date, ss.makeGenericType(ss.Dictionary$2, [String, ss.Int32])).call(null, this.$m_Dict, utcNowInMinute), hashTag);
			var $t2 = $FirehoseEater_DictionaryExtensions.getOrConstruct(Date, ss.makeGenericType(ss.Dictionary$2, [String, ss.Int32])).call(null, this.$m_Dict, utcNowInMinute);
			$t2.set_item(hashTag, $t2.get_item(hashTag) + 1);
		}
	},
	$getAvailableAggregation: function() {
		var src = ss.utcNow();
		var utcLastMinuteInMinute = new Date(src.getFullYear(), src.getMonth() + 1 - 1, src.getDate(), src.getHours(), src.getMinutes() - 1, 0);
		//return m_Dict.FirstOrDefault();  // TODO: delete
		return Enumerable.from(this.$m_Dict).firstOrDefault(function(m) {
			return m.key <= utcLastMinuteInMinute;
		}, ss.getDefaultValue(Object));
	},
	$deleteAggregateForMinute: function(date) {
		this.$m_Dict.remove(date);
	},
	$reset: function() {
		this.$m_Dict.clear();
	}
});
ss.initClass($FirehoseEater_DictionaryExtensions, exports, {});
ss.initClass($TwitterApiSalty_Credentials, exports, {});
ss.initClass($TwitterApiSalty_Options, exports, {});
ss.initClass($TwitterApiSalty_SqlServerFactory, exports, {});
ss.initClass($TwitterApiSalty_Tweet, exports, {});
ss.initClass($TwitterApiSalty_TwitterFactory, exports, {});
$TwitterApiSalty_SqlServerFactory.$m_Singleton = new ss.Lazy(function() {
	return require('mssql');
});
$FirehoseEater_$TwitterFirehose.$m_Singleton = new ss.Lazy(function() {
	return new $FirehoseEater_$TwitterFirehose();
});
$FirehoseEater_$TwitterFirehoseAggregator.$s_HashTagMatcher = new RegExp('[\\W](#\\w+)', 'g');
$FirehoseEater_$TwitterFirehoseAggregator.$m_Singleton = new ss.Lazy(function() {
	return new $FirehoseEater_$TwitterFirehoseAggregator($FirehoseEater_$TwitterFirehose.get_$instance());
});
$$Program.$m_Connection = null;
$$Program.$main();
$$TestTwitterFirehose.$m_Singleton = new ss.Lazy(function() {
	return new $$TestTwitterFirehose();
});
