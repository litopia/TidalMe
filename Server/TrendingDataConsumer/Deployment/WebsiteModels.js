'use strict';
require('mscorlib');
var SqlApi = require('SqlApi');
var TwitterApi = require('TwitterApi');
exports.WebsiteModels = exports.WebsiteModels || {};
ss.initAssembly(exports, 'WebsiteModels');
////////////////////////////////////////////////////////////////////////////////
// WebsiteModels.TweetResult
var $WebsiteModels_TweetResult = function() {
	this.userImage = null;
	this.userName = null;
	this.userScreenName = null;
	this.text = null;
	this.tweetImage = null;
};
$WebsiteModels_TweetResult.__typeName = 'WebsiteModels.TweetResult';
exports.WebsiteModels.TweetResult = $WebsiteModels_TweetResult;
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
////////////////////////////////////////////////////////////////////////////////
// WebsiteModels.TwitterTrendingDataModel.TwitterTrendingData
var $WebsiteModels_TwitterTrendingDataModel$TwitterTrendingData = function() {
	this.name = null;
	this.number = 0;
	this.tweet = null;
};
$WebsiteModels_TwitterTrendingDataModel$TwitterTrendingData.__typeName = 'WebsiteModels.TwitterTrendingDataModel$TwitterTrendingData';
exports.WebsiteModels.TwitterTrendingDataModel$TwitterTrendingData = $WebsiteModels_TwitterTrendingDataModel$TwitterTrendingData;
ss.initClass($WebsiteModels_TweetResult, exports, {});
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
	getData: function(callback, woeId, numDays) {
		if (ss.isNullOrUndefined($WebsiteModels_TwitterTrendingDataModel.$m_Connection)) {
			return;
		}
		var request = $WebsiteModels_TwitterTrendingDataModel.$m_Connection.request();
		request.query(ss.formatString('select top 10 Name as name, count(*) as number from TwtrTrendingData\r\nWHERE WoeId = {0} AND DATEDIFF(DAY, time, GETDATE()) <= {1}\r\nGROUP BY Name\r\nORDER BY count(*) desc', woeId, numDays), ss.mkdel(this, function(err, recordsets) {
			var $state = 0, tasks, $t1, record, trendingData, $t2, so, $t3;
			var $sm = ss.mkdel(this, function() {
				$sm1:
				for (;;) {
					switch ($state) {
						case 0: {
							$state = -1;
							if (!ss.isNullOrUndefined(err)) {
								console.info('err = ' + err);
								callback(null);
								$state = -1;
								break $sm1;
							}
							else {
								tasks = [];
								for ($t1 = 0; $t1 < recordsets.length; $t1++) {
									record = recordsets[$t1];
									trendingData = record;
									$t2 = new TwitterApi.TwitterApi.SearchOptions();
									$t2.count = 1;
									$t2.result_type = 'mixed';
									so = $t2;
									// Normalize Trending data
									trendingData.number = ss.Int32.div(trendingData.number * 100, numDays * 24 * 6);
									ss.add(tasks, this.$fillInTrendingDataWithTweet(trendingData, so));
								}
								$t3 = ss.Task.whenAll(ss.arrayFromEnumerable(tasks));
								$state = 1;
								$t3.continueWith($sm);
								return;
							}
						}
						case 1: {
							$state = -1;
							$t3.getResult();
							callback(recordsets);
							$state = -1;
							break $sm1;
						}
						default: {
							break $sm1;
						}
					}
				}
			});
			$sm();
		}));
	},
	$fillInTrendingDataWithTweet: function(trendingData, so) {
		var $state = 0, $tcs = new ss.TaskCompletionSource(), $t1, tweets;
		var $sm = ss.mkdel(this, function() {
			try {
				$sm1:
				for (;;) {
					switch ($state) {
						case 0: {
							$state = -1;
							$t1 = this.$getTweetWithRetries(trendingData.name, so);
							$state = 1;
							$t1.continueWith($sm);
							return;
						}
						case 1: {
							$state = -1;
							tweets = $t1.getResult();
							trendingData.tweet = Enumerable.from(tweets).first().text;
							console.info('**Finished ' + trendingData.name);
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
	getCurrentTweets: function(callback, query) {
		var $state = 0, $t1, so, $t2, tweets, results;
		var $sm = ss.mkdel(this, function() {
			$sm1:
			for (;;) {
				switch ($state) {
					case 0: {
						$state = -1;
						$t1 = new TwitterApi.TwitterApi.SearchOptions();
						$t1.include_entities = true;
						$t1.count = $WebsiteModels_TwitterTrendingDataModel.$counT_TWEETS;
						$t1.result_type = 'recent';
						so = $t1;
						$t2 = this.$getTweetWithRetries(query, so);
						$state = 1;
						$t2.continueWith($sm);
						return;
					}
					case 1: {
						$state = -1;
						tweets = $t2.getResult();
						if (!ss.staticEquals(callback, null)) {
							results = {};
							results['tweets'] = Enumerable.from(tweets).select(function(m) {
								var $t3 = new $WebsiteModels_TweetResult();
								$t3.text = m.text;
								$t3.userImage = m.user.profile_image_url;
								$t3.userName = m.user.name;
								$t3.userScreenName = m.user.screen_name;
								return $t3;
							}).take(20).toArray();
							//results["tweetsPerHour"] = (60 * 60 * 1000) * COUNT_TWEETS / (DateTime.Parse(tweets.First().CreateDate) - DateTime.Parse(tweets.Last().CreateDate));
							console.info('Callback for ' + query);
							callback(results);
						}
						$state = -1;
						break $sm1;
					}
					default: {
						break $sm1;
					}
				}
			}
		});
		$sm();
	},
	getPopularTweetImages: function(callback, query) {
		var $state = 0, $t1, so, $t2, tweets, results;
		var $sm = ss.mkdel(this, function() {
			$sm1:
			for (;;) {
				switch ($state) {
					case 0: {
						$state = -1;
						$t1 = new TwitterApi.TwitterApi.SearchOptions();
						$t1.include_entities = true;
						$t1.count = $WebsiteModels_TwitterTrendingDataModel.$counT_TWEETS;
						$t1.result_type = 'popular';
						so = $t1;
						$t2 = this.$getTweetWithRetries(query + ' filter:images', so);
						$state = 1;
						$t2.continueWith($sm);
						return;
					}
					case 1: {
						$state = -1;
						tweets = $t2.getResult();
						if (!ss.staticEquals(callback, null)) {
							results = {};
							results['tweets'] = Enumerable.from(tweets).select(function(m) {
								var $t3 = new $WebsiteModels_TweetResult();
								$t3.tweetImage = Enumerable.from(m.entities.media).first().media_url;
								return $t3;
							}).take(20).toArray();
							console.info('Callback for ' + query);
							callback(results);
						}
						$state = -1;
						break $sm1;
					}
					default: {
						break $sm1;
					}
				}
			}
		});
		$sm();
	},
	$getTweetWithRetries: function(query, options) {
		var $state = 0, $tcs = new ss.TaskCompletionSource(), $t1, x, e, $t3;
		var $sm = ss.mkdel(this, function() {
			try {
				$sm1:
				for (;;) {
					switch ($state) {
						case 0:
						case 1:
						case 2: {
							if ($state === 0) {
								$state = 1;
							}
							try {
								$sm2:
								for (;;) {
									switch ($state) {
										case 1: {
											$state = -1;
											$t1 = TwitterApi.TwitterApi.TrendsUtils.searchTweets(TwitterApi.TwitterApi.TrendsCredentialsUtils.getNextCredential(), query, options);
											$state = 2;
											$t1.continueWith($sm);
											return;
										}
										case 2: {
											$state = -1;
											x = $t1.getResult();
											console.info('*GetTweetWithRetries query: ' + query + '; x=' + Enumerable.from(x).first().text);
											$tcs.setResult(x);
											return;
										}
										default: {
											break $sm2;
										}
									}
								}
							}
							catch ($t2) {
								e = ss.Exception.wrap($t2);
								console.info('GetTweetWithRetries exception: ' + query + '; ex = ' + JSON.stringify(e));
								if (e.get_message() === 'Too Many Requests' || ss.isValue(e.get_innerException()) && e.get_innerException().get_message() === 'Too Many Requests') {
									TwitterApi.TwitterApi.TrendsCredentialsUtils.invalidateCredential();
								}
								else {
									throw $t2;
								}
							}
							// Only way to get here is if an Exception is caught but not rethrown
							$t3 = this.$getTweetWithRetries(query, options);
							$state = 3;
							$t3.continueWith($sm);
							return;
						}
						case 3: {
							$state = -1;
							$tcs.setResult($t3.getResult());
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
		});
		$sm();
		return $tcs.task;
	}
});
ss.initClass($WebsiteModels_TwitterTrendingDataModel$TwitterTrendingData, exports, {});
$WebsiteModels_TwitterTrendingDataModel.$m_Connection = null;
$WebsiteModels_TwitterTrendingDataModel.$counT_TWEETS = 20;
$WebsiteModels_TwitterTrendingDataModel.$initialize();
