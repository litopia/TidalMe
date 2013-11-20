'use strict';
require('mscorlib');
var http = require('http');
var SqlApi = require('SqlApi');
var TwitterApi = require('TwitterApi');
exports.SqlApi = exports.SqlApi || {};
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
					$SqlApi_$TwitterTrendsAggregator.get_$instance().add_$onTrendsReady($$Program.$onTrendsReady);
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
	var $t1 = new TwitterApi.SqlApi.Credentials();
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
// SqlApi.FileLoader
var $SqlApi_$FileLoader = function() {
};
$SqlApi_$FileLoader.__typeName = 'SqlApi.$FileLoader';
////////////////////////////////////////////////////////////////////////////////
// SqlApi.TwitterLocations
var $SqlApi_$TwitterLocations = function() {
	this.$m_Lock = new Object();
	this.$m_ValidCredentials = null;
	this.$m_LocationsRetrievedEvent = new $SqlApi_ManualResetEvent();
	this.$m_ValidCredentials = TwitterApi.SqlApi.TrendsUtils.getValidCredentials();
};
$SqlApi_$TwitterLocations.__typeName = 'SqlApi.$TwitterLocations';
$SqlApi_$TwitterLocations.get_$instance = function() {
	return $SqlApi_$TwitterLocations.$m_singleton.value();
};
////////////////////////////////////////////////////////////////////////////////
// SqlApi.TwitterTrendsAggregator
var $SqlApi_$TwitterTrendsAggregator = function() {
	this.$m_Lock = new Object();
	this.$m_ValidCredentials = null;
	this.$1$OnTrendsReadyField = null;
	this.$m_ValidCredentials = TwitterApi.SqlApi.TrendsUtils.getValidCredentials();
	this.$requestTrends();
	setInterval(ss.mkdel(this, function() {
		this.$requestTrends();
	}), 540000);
	// 9 min
};
$SqlApi_$TwitterTrendsAggregator.__typeName = 'SqlApi.$TwitterTrendsAggregator';
$SqlApi_$TwitterTrendsAggregator.get_$instance = function() {
	return $SqlApi_$TwitterTrendsAggregator.$m_singleton.value();
};
////////////////////////////////////////////////////////////////////////////////
// SqlApi.DictionaryExtensions
var $SqlApi_DictionaryExtensions = function() {
};
$SqlApi_DictionaryExtensions.__typeName = 'SqlApi.DictionaryExtensions';
$SqlApi_DictionaryExtensions.getOrConstruct = function(Key, Value) {
	return function(dict, key) {
		if (dict.containsKey(key)) {
			return dict.get_item(key);
		}
		var val = ss.createInstance(Value);
		dict.set_item(key, val);
		return dict.get_item(key);
	};
};
exports.SqlApi.DictionaryExtensions = $SqlApi_DictionaryExtensions;
////////////////////////////////////////////////////////////////////////////////
// SqlApi.IReadOnlyResetEvent
var $SqlApi_IReadOnlyResetEvent = function() {
};
$SqlApi_IReadOnlyResetEvent.__typeName = 'SqlApi.IReadOnlyResetEvent';
exports.SqlApi.IReadOnlyResetEvent = $SqlApi_IReadOnlyResetEvent;
////////////////////////////////////////////////////////////////////////////////
// SqlApi.ManualResetEvent
var $SqlApi_ManualResetEvent = function() {
	this.$1$IsSignaledField = false;
	this.$m_StoredCallbacks = [];
};
$SqlApi_ManualResetEvent.__typeName = 'SqlApi.ManualResetEvent';
exports.SqlApi.ManualResetEvent = $SqlApi_ManualResetEvent;
ss.initClass($$Program, exports, {});
ss.initClass($$TestProgram, exports, {});
ss.initClass($SqlApi_$FileLoader, exports, {});
ss.initClass($SqlApi_$TwitterLocations, exports, {
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
											$t1 = TwitterApi.SqlApi.TrendsUtils.getTrendLocations(this.$getNextCredential());
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
											$t3 = SqlApi.SqlApi.SqlUtils.getSqlConnection();
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
ss.initClass($SqlApi_$TwitterTrendsAggregator, exports, {
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
							$t1 = ss.Task.whenAll(ss.arrayFromEnumerable(Enumerable.from($SqlApi_$TwitterTrendsAggregator.$m_ValidWoeIds).select(ss.mkdel(this, function(woeid) {
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
											$t1 = TwitterApi.SqlApi.TrendsUtils.getTrend(this.$getNextCredential(), woeid);
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
ss.initClass($SqlApi_DictionaryExtensions, exports, {});
ss.initInterface($SqlApi_IReadOnlyResetEvent, exports, { waitOne: null, get_isSignaled: null });
ss.initClass($SqlApi_ManualResetEvent, exports, {
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
}, null, [$SqlApi_IReadOnlyResetEvent]);
$SqlApi_$TwitterTrendsAggregator.$m_singleton = new ss.Lazy(function() {
	return new $SqlApi_$TwitterTrendsAggregator();
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
$SqlApi_$TwitterTrendsAggregator.$m_ValidWoeIds = $t1;
$$Program.$m_Connection = null;
$$Program.$main();
$SqlApi_$TwitterLocations.$m_singleton = new ss.Lazy(function() {
	return new $SqlApi_$TwitterLocations();
});
//Instance.RequestLocations();
