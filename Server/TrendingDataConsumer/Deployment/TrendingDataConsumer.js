'use strict';
require('mscorlib');
var http = require('http');
exports.FirehoseEater = exports.FirehoseEater || {};
exports.TwitterApiSalty = exports.TwitterApiSalty || {};
ss.initAssembly(exports, 'TrendingDataConsumer');
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
					//ProcessTweetData();
					$FirehoseEater_$TwitterTrendsAggregator.get_$instance().add_$onTrendsReady($$Program.$onTrendsReady);
					//for (int i = 0; i < 20; i++)
					//{
					//    NodeJS.Console.Info(i);
					//    try
					//    {
					//        TrendsContainer trendsContainer = await TrendsUtils.GetTrend(creds, 1);
					//        NodeJS.Console.Info(Json.Stringify(trendsContainer));
					//        NodeJS.Console.Info("-----------------------");
					//        NodeJS.Console.Info(Json.Stringify(trendsContainer.Trends[0].Name));
					//    }
					//    catch (Exception e)
					//    {
					//        if (e.Message == "Too Many Requests" ||
					//            (e.InnerException != null && e.InnerException.Message == "Too Many Requests"))
					//        {
					//            NodeJS.Console.Info("Too Many Requests Exception");
					//        }
					//        else
					//        {
					//            NodeJS.Console.Info("Regular Exception: " + e.Message);
					//        }
					//    }
					//}
					//Globals.SetInterval(ProcessTweetData, 50 * 1000);  // Every 50s
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
$$Program.$onTrendsReady = function(woeid, trendsContainer) {
	//NodeJS.Console.Info(String.Format("AsOf{2}  CreatedAt{3}     : woeid ({0})'s first trend is {1}", woeid, String.Join(",", trendsContainer.Trends.Select(trend => trend.Name)), trendsContainer.AsOf, trendsContainer.CreatedAt));
	//foreach (Trend trend in trendsContainer.Trends)
	for (var i = 0; i < trendsContainer.trends.length; i++) {
		var trend = trendsContainer.trends[i];
		console.info('Inserting ' + trend.name + ' to sql');
		// Got the trends, now we should send the data to SQL
		var request = $$Program.$m_Connection.request();
		request.query(ss.formatString("insert TwtrTrendingData (Time, WoeId, Name, Query, Events, PromotedContent, Rank) Values('{0}', {1}, '{2}', '{3}', '{4}', '{5}', {6})", trendsContainer.created_at, woeid, trend.name, trend.query, trend.events, trend.promoted_content, i), function(err, recordsets) {
			if (!ss.isNullOrUndefined(err)) {
				console.info('err = ' + err);
			}
		});
	}
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
	var $t1 = new $TwitterApiSalty_Credentials();
	$t1.consumer_key = '5iaBY1vY49ngNJBMy0vw';
	$t1.consumer_secret = 'bBx36uscbcaY0h7kX9HktfVzty7Vyb7n0FJcEgw8';
	$t1.access_token_key = '325955870-uePDCtgtivjrOyUnTORwGOXpRlBn3rCC1xAeDOcB';
	$t1.access_token_secret = 'Emv6SBI8Yevn5MhiBIsjvJ8Ub5G6lOrU3UylRUoqMgaev';
	var creds = $t1;
	var twitter = require('twitter');
	var twitterObj = new twitter(creds);
	console.info('Before GET');
	var options = {};
	options['id'] = 1;
	twitterObj.get('/trends/place.json', options, function(data) {
		console.info(JSON.stringify(data));
	});
	// USEFUL
	// curl --get 'https://api.twitter.com/1.1/search/tweets.json' --data 'filter=images&mode=photos&q=%23InitialsOfSomeoneSpecial&src=tren' --header 'Authorization: OAuth oauth_consumer_key="SCRBMIoNmWZS9Aqo2tNg", oauth_nonce="a7d4e9f251984c1ddcb88f680c6c11db", oauth_signature="z6Ml714ukb5DgNEKcihf5rbdFuI%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1384129430", oauth_token="325955870-7ttUlmgwjgwvRVILUO7aOZ3K65EPJH3El9bpCyqA", oauth_version="1.0"' --verbose
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
// FirehoseEater.TwitterLocations
var $FirehoseEater_$TwitterLocations = function() {
	this.$m_Lock = new Object();
	this.$m_ValidCredentials = null;
	this.$m_LocationsRetrievedEvent = new $FirehoseEater_ManualResetEvent();
	this.$m_ValidCredentials = $FirehoseEater_TrendsUtils.getValidCredentials();
};
$FirehoseEater_$TwitterLocations.__typeName = 'FirehoseEater.$TwitterLocations';
$FirehoseEater_$TwitterLocations.get_$instance = function() {
	return $FirehoseEater_$TwitterLocations.$m_singleton.value();
};
////////////////////////////////////////////////////////////////////////////////
// FirehoseEater.TwitterTrendsAggregator
var $FirehoseEater_$TwitterTrendsAggregator = function() {
	this.$m_Lock = new Object();
	this.$m_ValidCredentials = null;
	this.$1$OnTrendsReadyField = null;
	this.$m_ValidCredentials = $FirehoseEater_TrendsUtils.getValidCredentials();
	this.$requestTrends();
	setInterval(ss.mkdel(this, function() {
		this.$requestTrends();
	}), 540000);
	// 9 min
};
$FirehoseEater_$TwitterTrendsAggregator.__typeName = 'FirehoseEater.$TwitterTrendsAggregator';
$FirehoseEater_$TwitterTrendsAggregator.get_$instance = function() {
	return $FirehoseEater_$TwitterTrendsAggregator.$m_singleton.value();
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
// FirehoseEater.IReadOnlyResetEvent
var $FirehoseEater_IReadOnlyResetEvent = function() {
};
$FirehoseEater_IReadOnlyResetEvent.__typeName = 'FirehoseEater.IReadOnlyResetEvent';
exports.FirehoseEater.IReadOnlyResetEvent = $FirehoseEater_IReadOnlyResetEvent;
////////////////////////////////////////////////////////////////////////////////
// FirehoseEater.ManualResetEvent
var $FirehoseEater_ManualResetEvent = function() {
	this.$1$IsSignaledField = false;
	this.$m_StoredCallbacks = [];
};
$FirehoseEater_ManualResetEvent.__typeName = 'FirehoseEater.ManualResetEvent';
exports.FirehoseEater.ManualResetEvent = $FirehoseEater_ManualResetEvent;
////////////////////////////////////////////////////////////////////////////////
// FirehoseEater.SqlUtils
var $FirehoseEater_SqlUtils = function() {
};
$FirehoseEater_SqlUtils.__typeName = 'FirehoseEater.SqlUtils';
$FirehoseEater_SqlUtils.getSqlConnection = function() {
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
exports.FirehoseEater.SqlUtils = $FirehoseEater_SqlUtils;
////////////////////////////////////////////////////////////////////////////////
// FirehoseEater.TrendsUtils
var $FirehoseEater_TrendsUtils = function() {
};
$FirehoseEater_TrendsUtils.__typeName = 'FirehoseEater.TrendsUtils';
$FirehoseEater_TrendsUtils.getTrend = function(creds, woeid) {
	var $state = 0, $tcs = new ss.TaskCompletionSource(), tcs, twitter, twitterObj, hashTags, beginningTime, options;
	var $sm = function() {
		try {
			$sm1:
			for (;;) {
				switch ($state) {
					case 0: {
						$state = -1;
						tcs = new ss.TaskCompletionSource();
						twitter = require('twitter');
						twitterObj = new twitter(creds);
						hashTags = new (ss.makeGenericType(ss.Dictionary$2, [String, ss.Int32]))();
						beginningTime = new Date();
						options = {};
						options['id'] = woeid;
						twitterObj.get('/trends/place.json', options, function(data) {
							//NodeJS.Console.Info("Requesting Trend: " + Json.Stringify(data));
							if (!ss.referenceEquals(ss.getInstanceType(data), Array)) {
								// error
								if (!!ss.referenceEquals(data.statusCode, 429)) {
									tcs.setException(new ss.Exception('Too Many Requests'));
								}
								else {
									tcs.setException(new ss.Exception(data.toString()));
								}
								return;
							}
							var dataArray = ss.cast(data, Array);
							var trendsContainer = dataArray[0];
							tcs.setResult(trendsContainer);
						});
						$state = 1;
						tcs.task.continueWith($sm);
						return;
					}
					case 1: {
						$state = -1;
						$tcs.setResult(tcs.task.getResult());
						return;
					}
					default: {
						break $sm1;
					}
				}
			}
		}
		catch ($t1) {
			$tcs.setException(ss.Exception.wrap($t1));
		}
	};
	$sm();
	return $tcs.task;
};
$FirehoseEater_TrendsUtils.getTrendLocations = function(creds) {
	var $state = 0, $tcs = new ss.TaskCompletionSource(), tcs, twitter, twitterObj, options;
	var $sm = function() {
		try {
			$sm1:
			for (;;) {
				switch ($state) {
					case 0: {
						$state = -1;
						tcs = new ss.TaskCompletionSource();
						twitter = require('twitter');
						twitterObj = new twitter(creds);
						options = {};
						twitterObj.get('/trends/available.json', options, function(data) {
							if (!ss.referenceEquals(ss.getInstanceType(data), Array)) {
								// error
								if (!!ss.referenceEquals(data.statusCode, 429)) {
									tcs.setException(new ss.Exception('Too Many Requests'));
								}
								else {
									tcs.setException(new ss.Exception(data.toString()));
								}
								return;
							}
							var dataArray = ss.cast(data, Array);
							var trendLocationsContainer = dataArray;
							tcs.setResult(trendLocationsContainer);
						});
						$state = 1;
						tcs.task.continueWith($sm);
						return;
					}
					case 1: {
						$state = -1;
						$tcs.setResult(tcs.task.getResult());
						return;
					}
					default: {
						break $sm1;
					}
				}
			}
		}
		catch ($t1) {
			$tcs.setException(ss.Exception.wrap($t1));
		}
	};
	$sm();
	return $tcs.task;
};
$FirehoseEater_TrendsUtils.getValidCredentials = function() {
	var $t1 = [];
	var $t2 = new $TwitterApiSalty_Credentials();
	$t2.consumer_key = '5iaBY1vY49ngNJBMy0vw';
	$t2.consumer_secret = 'bBx36uscbcaY0h7kX9HktfVzty7Vyb7n0FJcEgw8';
	$t2.access_token_key = '325955870-uePDCtgtivjrOyUnTORwGOXpRlBn3rCC1xAeDOcB';
	$t2.access_token_secret = 'Emv6SBI8Yevn5MhiBIsjvJ8Ub5G6lOrU3UylRUoqMgaev';
	ss.add($t1, $t2);
	null;
	var $t3 = new $TwitterApiSalty_Credentials();
	$t3.consumer_key = 'SCRBMIoNmWZS9Aqo2tNg';
	$t3.consumer_secret = 'yIXVi2hLqrnRWjFvyRHRgGw5u2XFpJgucT8O7yYFTI';
	$t3.access_token_key = '325955870-7ttUlmgwjgwvRVILUO7aOZ3K65EPJH3El9bpCyqA';
	$t3.access_token_secret = 'YtHHt9xI0ikCG0hwq5HzHAg2t6bF64q4MsESqE6Us';
	ss.add($t1, $t3);
	null;
	var $t4 = new $TwitterApiSalty_Credentials();
	$t4.consumer_key = 'P5KR6e8ZxKiY87XQQAd39Q';
	$t4.consumer_secret = 'esh2cw3vfs5kvaNNCeWjx7IVAX7si6z85rlZfmSY';
	$t4.access_token_key = '325955870-0vFjVCoNBElK7EmfkctMpOdmZ1SkLXPj3EvyPhmH';
	$t4.access_token_secret = 'AFxEICma0IiM1C6mYY0kgy4vjvXODLg3lp2Q7F2EFA';
	ss.add($t1, $t4);
	null;
	var $t5 = new $TwitterApiSalty_Credentials();
	$t5.consumer_key = 'P0s5R4P8bUltW2UFkuQ';
	$t5.consumer_secret = 'B0jKf4YVnm4aRDyjxT9QiWHD1QGzqAUDRM4s8bf1k8';
	$t5.access_token_key = '80748695-lG15zHRrEWndVeAURLqHt0FgECU9mNIo4pAkxu2wv';
	$t5.access_token_secret = 'znPCZkQXexrR2c2zOKJoCCsDxhIton2un6VPKFvBg';
	ss.add($t1, $t5);
	null;
	var $t6 = new $TwitterApiSalty_Credentials();
	$t6.consumer_key = 'hiiz5qRbOA5CDYywFuSOg';
	$t6.consumer_secret = 'jRlw2sskOEWalxMVsBcDo9fSCSjK9hmuYIUAqKpdk';
	$t6.access_token_key = '80748695-xBvHCQadwIaHe3AotZzFw35Q5LG9bpxjys6Zxawjk';
	$t6.access_token_secret = 'ZNrQ03U3qGZQB9vbNcSfHyxnfK2V7SC0bkXQvAAvKE';
	ss.add($t1, $t6);
	null;
	var $t7 = new $TwitterApiSalty_Credentials();
	$t7.consumer_key = 'VMfotpGVu4THBiUNaJjKTQ';
	$t7.consumer_secret = 'f6qEWmuFg5AFpTgVLHFmrvutNOO4ulDTU4GW8L00E';
	$t7.access_token_key = '80748695-OWCqpYaEz3PKBkgGioQumbsRLlGO4izeWqj5KPsv1';
	$t7.access_token_secret = 'zFSxreQkaAzK5h6ZShaQhS26BT92H3eRgHJqWkBTOs';
	ss.add($t1, $t7);
	null;
	var $t8 = new $TwitterApiSalty_Credentials();
	$t8.consumer_key = 'OSBkZmRwht81gQWUloLjQw';
	$t8.consumer_secret = 'hkmy6bbfRPgYmsXo8suyiyVRxaP1qt1sa8nG7Fg2Q';
	$t8.access_token_key = '80748695-w6K9EG6QlzOODwE0ejHZsSk4IhxbRZV2oLROPr7H2';
	$t8.access_token_secret = 'HW6y9MQ6gPzF8kuyrr11AXmrn4gA0hT4iOPwh73UM';
	ss.add($t1, $t8);
	null;
	var $t9 = new $TwitterApiSalty_Credentials();
	$t9.consumer_key = 'SQ1MfzVE9inxcwBJ8n0U2Q';
	$t9.consumer_secret = 'RcV80HDoYaGYFeoNe3vKYyXSGfUUXTQ0qgm5a63NSc';
	$t9.access_token_key = '325955870-pHjF1PAbpmCKHQ2Y0zEeaCQ7bsvEStneiHbErxX6';
	$t9.access_token_secret = 'JFlEk4FahPn8TVUOvIPXel7Xbw4gdTiB0TrwEsP9C5to0';
	ss.add($t1, $t9);
	null;
	return Enumerable.from($t1).orderBy(function(m) {
		return ss.Guid.newGuid();
	}).toArray();
};
exports.FirehoseEater.TrendsUtils = $FirehoseEater_TrendsUtils;
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
// TwitterApiSalty.Trend
var $TwitterApiSalty_Trend = function() {
	this.name = null;
	this.url = null;
	this.promoted_content = null;
	this.query = null;
	this.events = null;
};
$TwitterApiSalty_Trend.__typeName = 'TwitterApiSalty.Trend';
exports.TwitterApiSalty.Trend = $TwitterApiSalty_Trend;
////////////////////////////////////////////////////////////////////////////////
// TwitterApiSalty.TrendsContainer
var $TwitterApiSalty_TrendsContainer = function() {
	this.as_of = new Date(0);
	this.created_at = new Date(0);
	this.trends = null;
};
$TwitterApiSalty_TrendsContainer.__typeName = 'TwitterApiSalty.TrendsContainer';
exports.TwitterApiSalty.TrendsContainer = $TwitterApiSalty_TrendsContainer;
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
////////////////////////////////////////////////////////////////////////////////
// TwitterApiSalty.TwitterTrendsLocation
var $TwitterApiSalty_TwitterTrendsLocation = function() {
	this.name = null;
	this.placeType = null;
	this.url = null;
	this.parentid = 0;
	this.country = null;
	this.woeid = 0;
	this.countryCode = null;
};
$TwitterApiSalty_TwitterTrendsLocation.__typeName = 'TwitterApiSalty.TwitterTrendsLocation';
exports.TwitterApiSalty.TwitterTrendsLocation = $TwitterApiSalty_TwitterTrendsLocation;
////////////////////////////////////////////////////////////////////////////////
// TwitterApiSalty.TwitterTrendsPlaceType
var $TwitterApiSalty_TwitterTrendsPlaceType = function() {
	this.code = 0;
	this.name = null;
};
$TwitterApiSalty_TwitterTrendsPlaceType.__typeName = 'TwitterApiSalty.TwitterTrendsPlaceType';
exports.TwitterApiSalty.TwitterTrendsPlaceType = $TwitterApiSalty_TwitterTrendsPlaceType;
ss.initClass($$Program, exports, {});
ss.initClass($$TestProgram, exports, {});
ss.initClass($SqlConfiguration, exports, {});
ss.initClass($FirehoseEater_$FileLoader, exports, {});
ss.initClass($FirehoseEater_$TwitterLocations, exports, {
	get_$locationsRetrievedEvent: function() {
		return this.$m_LocationsRetrievedEvent;
	},
	$requestLocations: function() {
		var $state = 0, $tcs = new ss.TaskCompletionSource(), $t1, trendsContainer, $t2, loc, $t3, sqlConnection, request, e;
		var $sm = ss.mkdel(this, function() {
			try {
				$sm1:
				for (;;) {
					switch ($state) {
						case 0: {
							$state = -1;
							console.info('Requesting Locations');
							$state = 1;
							continue $sm1;
						}
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7: {
							if ($state === 1) {
								$state = 2;
							}
							try {
								$sm2:
								for (;;) {
									switch ($state) {
										case 2: {
											$state = -1;
											$t1 = $FirehoseEater_TrendsUtils.getTrendLocations(this.$getNextCredential());
											$state = 3;
											$t1.continueWith($sm);
											return;
										}
										case 3: {
											$state = -1;
											trendsContainer = $t1.getResult();
											$t2 = 0;
											$state = 4;
											continue $sm2;
										}
										case 4: {
											$state = -1;
											if (!($t2 < trendsContainer.length)) {
												$state = 6;
												continue $sm2;
											}
											loc = trendsContainer[$t2];
											console.info('Inserting ' + loc.name + ' to sql');
											// Got the trends, now we should send the data to SQL
											$t3 = $FirehoseEater_SqlUtils.getSqlConnection();
											$state = 7;
											$t3.continueWith($sm);
											return;
										}
										case 7: {
											$state = -1;
											sqlConnection = $t3.getResult();
											request = sqlConnection.request();
											request.query(ss.formatString("insert Location (WoeId, Country, CountryCode, Name, ParentId, PlaceTypeCode, Url) Values({0}, '{1}', '{2}', '{3}', {4}, {5}, '{6}')", loc.woeid, loc.country, loc.countryCode, loc.name, loc.parentid, loc.placeType.code, loc.url), function(err, recordsets) {
												if (!ss.isNullOrUndefined(err)) {
													console.info('err = ' + err);
												}
											});
											$state = 5;
											continue $sm2;
										}
										case 5: {
											$state = -1;
											$t2++;
											$state = 4;
											continue $sm2;
										}
										case 6: {
											$state = -1;
											this.$m_LocationsRetrievedEvent.signal();
											$state = -1;
											break $sm2;
										}
										default: {
											break $sm2;
										}
									}
								}
							}
							catch ($t4) {
								e = ss.Exception.wrap($t4);
								if (e.get_message() === 'Too Many Requests' || ss.isValue(e.get_innerException()) && e.get_innerException().get_message() === 'Too Many Requests') {
									this.$invalidateCredential();
									this.$requestLocations();
									$tcs.setResult(null);
									return;
								}
								else {
									throw $t4;
								}
							}
							$state = -1;
							break $sm1;
						}
						default: {
							break $sm1;
						}
					}
				}
				$tcs.setResult(null);
			}
			catch ($t5) {
				$tcs.setException(ss.Exception.wrap($t5));
			}
		});
		$sm();
		return $tcs.task;
	},
	$getNextCredential: function() {
		this.$m_Lock;
		{
			return Enumerable.from(this.$m_ValidCredentials).first();
		}
	},
	$invalidateCredential: function() {
		this.$m_Lock;
		{
			// Put the invalidated one at the end
			var hold = Enumerable.from(this.$m_ValidCredentials).first();
			ss.removeAt(this.$m_ValidCredentials, 0);
			ss.add(this.$m_ValidCredentials, hold);
		}
	}
});
ss.initClass($FirehoseEater_$TwitterTrendsAggregator, exports, {
	add_$onTrendsReady: function(value) {
		this.$1$OnTrendsReadyField = ss.delegateCombine(this.$1$OnTrendsReadyField, value);
	},
	remove_$onTrendsReady: function(value) {
		this.$1$OnTrendsReadyField = ss.delegateRemove(this.$1$OnTrendsReadyField, value);
	},
	$requestTrends: function() {
		var $state = 0, $tcs = new ss.TaskCompletionSource(), $t1;
		var $sm = ss.mkdel(this, function() {
			try {
				$sm1:
				for (;;) {
					switch ($state) {
						case 0: {
							$state = -1;
							$t1 = ss.Task.whenAll(ss.arrayFromEnumerable(Enumerable.from($FirehoseEater_$TwitterTrendsAggregator.$m_ValidWoeIds).select(ss.mkdel(this, function(woeid) {
								return this.$requestTrend(woeid);
							}))));
							$state = 1;
							$t1.continueWith($sm);
							return;
						}
						case 1: {
							$state = -1;
							$t1.getResult();
							$state = -1;
							break $sm1;
						}
						default: {
							break $sm1;
						}
					}
				}
				$tcs.setResult(null);
			}
			catch ($t2) {
				$tcs.setException(ss.Exception.wrap($t2));
			}
		});
		$sm();
		return $tcs.task;
	},
	$requestTrend: function(woeid) {
		var $state = 0, $tcs = new ss.TaskCompletionSource(), $t1, trendsContainer, e;
		var $sm = ss.mkdel(this, function() {
			try {
				$sm1:
				for (;;) {
					switch ($state) {
						case 0: {
							$state = -1;
							console.info('Requesting Trend: ' + woeid);
							$state = 1;
							continue $sm1;
						}
						case 1:
						case 2:
						case 3: {
							if ($state === 1) {
								$state = 2;
							}
							try {
								$sm2:
								for (;;) {
									switch ($state) {
										case 2: {
											$state = -1;
											$t1 = $FirehoseEater_TrendsUtils.getTrend(this.$getNextCredential(), woeid);
											$state = 3;
											$t1.continueWith($sm);
											return;
										}
										case 3: {
											$state = -1;
											trendsContainer = $t1.getResult();
											if (!ss.staticEquals(this.$1$OnTrendsReadyField, null)) {
												this.$1$OnTrendsReadyField(woeid, trendsContainer);
											}
											$state = -1;
											break $sm2;
										}
										default: {
											break $sm2;
										}
									}
								}
							}
							catch ($t2) {
								e = ss.Exception.wrap($t2);
								if (e.get_message() === 'Too Many Requests' || ss.isValue(e.get_innerException()) && e.get_innerException().get_message() === 'Too Many Requests') {
									this.$invalidateCredential();
									this.$requestTrend(woeid);
									$tcs.setResult(null);
									return;
								}
								else {
									throw $t2;
								}
							}
							$state = -1;
							break $sm1;
						}
						default: {
							break $sm1;
						}
					}
				}
				$tcs.setResult(null);
			}
			catch ($t3) {
				$tcs.setException(ss.Exception.wrap($t3));
			}
		});
		$sm();
		return $tcs.task;
	},
	$getNextCredential: function() {
		this.$m_Lock;
		{
			return Enumerable.from(this.$m_ValidCredentials).first();
		}
	},
	$invalidateCredential: function() {
		this.$m_Lock;
		{
			// Put the invalidated one at the end
			var hold = Enumerable.from(this.$m_ValidCredentials).first();
			ss.removeAt(this.$m_ValidCredentials, 0);
			ss.add(this.$m_ValidCredentials, hold);
		}
	}
});
ss.initClass($FirehoseEater_DictionaryExtensions, exports, {});
ss.initInterface($FirehoseEater_IReadOnlyResetEvent, exports, { waitOne: null, get_isSignaled: null });
ss.initClass($FirehoseEater_ManualResetEvent, exports, {
	get_isSignaled: function() {
		return this.$1$IsSignaledField;
	},
	set_isSignaled: function(value) {
		this.$1$IsSignaledField = value;
	},
	signal: function() {
		if (this.get_isSignaled()) {
			return;
		}
		for (var $t1 = 0; $t1 < this.$m_StoredCallbacks.length; $t1++) {
			var storedCallback = this.$m_StoredCallbacks[$t1];
			storedCallback();
		}
		ss.clear(this.$m_StoredCallbacks);
		this.set_isSignaled(true);
	},
	waitOne: function(callback) {
		if (this.get_isSignaled()) {
			callback();
		}
		else {
			ss.add(this.$m_StoredCallbacks, callback);
		}
	},
	reset: function() {
		this.set_isSignaled(false);
	}
}, null, [$FirehoseEater_IReadOnlyResetEvent]);
ss.initClass($FirehoseEater_SqlUtils, exports, {});
ss.initClass($FirehoseEater_TrendsUtils, exports, {});
ss.initClass($TwitterApiSalty_Credentials, exports, {});
ss.initClass($TwitterApiSalty_Options, exports, {});
ss.initClass($TwitterApiSalty_SqlServerFactory, exports, {});
ss.initClass($TwitterApiSalty_Trend, exports, {});
ss.initClass($TwitterApiSalty_TrendsContainer, exports, {});
ss.initClass($TwitterApiSalty_Tweet, exports, {});
ss.initClass($TwitterApiSalty_TwitterFactory, exports, {});
ss.initClass($TwitterApiSalty_TwitterTrendsLocation, exports, {});
ss.initClass($TwitterApiSalty_TwitterTrendsPlaceType, exports, {});
$FirehoseEater_$TwitterTrendsAggregator.$m_singleton = new ss.Lazy(function() {
	return new $FirehoseEater_$TwitterTrendsAggregator();
});
var $t1 = [];
ss.add($t1, 1);
null;
ss.add($t1, 23424738);
null;
ss.add($t1, 23424747);
null;
ss.add($t1, 23424748);
null;
ss.add($t1, 23424757);
null;
ss.add($t1, 23424768);
null;
ss.add($t1, 23424775);
null;
ss.add($t1, 23424782);
null;
ss.add($t1, 23424787);
null;
ss.add($t1, 23424800);
null;
ss.add($t1, 23424801);
null;
ss.add($t1, 23424803);
null;
ss.add($t1, 23424819);
null;
ss.add($t1, 23424829);
null;
ss.add($t1, 23424833);
null;
ss.add($t1, 23424834);
null;
ss.add($t1, 23424846);
null;
ss.add($t1, 23424848);
null;
ss.add($t1, 23424853);
null;
ss.add($t1, 23424856);
null;
ss.add($t1, 23424863);
null;
ss.add($t1, 23424868);
null;
ss.add($t1, 23424900);
null;
ss.add($t1, 23424901);
null;
ss.add($t1, 23424908);
null;
ss.add($t1, 23424909);
null;
ss.add($t1, 23424910);
null;
ss.add($t1, 23424916);
null;
ss.add($t1, 23424919);
null;
ss.add($t1, 23424922);
null;
ss.add($t1, 23424923);
null;
ss.add($t1, 23424925);
null;
ss.add($t1, 23424934);
null;
ss.add($t1, 23424936);
null;
ss.add($t1, 23424942);
null;
ss.add($t1, 23424948);
null;
ss.add($t1, 23424950);
null;
ss.add($t1, 23424954);
null;
ss.add($t1, 23424969);
null;
ss.add($t1, 23424975);
null;
ss.add($t1, 23424976);
null;
ss.add($t1, 23424977);
null;
ss.add($t1, 23424982);
null;
$FirehoseEater_$TwitterTrendsAggregator.$m_ValidWoeIds = $t1;
$TwitterApiSalty_SqlServerFactory.$m_Singleton = new ss.Lazy(function() {
	return require('mssql');
});
$$Program.$m_Connection = null;
$$Program.$main();
$FirehoseEater_$TwitterLocations.$m_singleton = new ss.Lazy(function() {
	return new $FirehoseEater_$TwitterLocations();
});
//Instance.RequestLocations();
