(function() {
	'use strict';
	exports.SqlApi = exports.SqlApi || {};
	ss.initAssembly(exports, 'TwitterApi');
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.Credentials
	var $SqlApi_Credentials = function() {
		this.consumer_key = null;
		this.consumer_secret = null;
		this.access_token_key = null;
		this.access_token_secret = null;
	};
	$SqlApi_Credentials.__typeName = 'SqlApi.Credentials';
	exports.SqlApi.Credentials = $SqlApi_Credentials;
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.Trend
	var $SqlApi_Trend = function() {
		this.name = null;
		this.url = null;
		this.promoted_content = null;
		this.query = null;
		this.events = null;
	};
	$SqlApi_Trend.__typeName = 'SqlApi.Trend';
	exports.SqlApi.Trend = $SqlApi_Trend;
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.TrendsContainer
	var $SqlApi_TrendsContainer = function() {
		this.as_of = new Date(0);
		this.created_at = new Date(0);
		this.trends = null;
	};
	$SqlApi_TrendsContainer.__typeName = 'SqlApi.TrendsContainer';
	exports.SqlApi.TrendsContainer = $SqlApi_TrendsContainer;
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.TrendsUtils
	var $SqlApi_TrendsUtils = function() {
	};
	$SqlApi_TrendsUtils.__typeName = 'SqlApi.TrendsUtils';
	$SqlApi_TrendsUtils.getTrend = function(creds, woeid) {
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
	$SqlApi_TrendsUtils.getTrendLocations = function(creds) {
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
	$SqlApi_TrendsUtils.getValidCredentials = function() {
		var $t1 = [];
		var $t2 = new $SqlApi_Credentials();
		$t2.consumer_key = '5iaBY1vY49ngNJBMy0vw';
		$t2.consumer_secret = 'bBx36uscbcaY0h7kX9HktfVzty7Vyb7n0FJcEgw8';
		$t2.access_token_key = '325955870-uePDCtgtivjrOyUnTORwGOXpRlBn3rCC1xAeDOcB';
		$t2.access_token_secret = 'Emv6SBI8Yevn5MhiBIsjvJ8Ub5G6lOrU3UylRUoqMgaev';
		ss.add($t1, $t2);
		null;
		var $t3 = new $SqlApi_Credentials();
		$t3.consumer_key = 'SCRBMIoNmWZS9Aqo2tNg';
		$t3.consumer_secret = 'yIXVi2hLqrnRWjFvyRHRgGw5u2XFpJgucT8O7yYFTI';
		$t3.access_token_key = '325955870-7ttUlmgwjgwvRVILUO7aOZ3K65EPJH3El9bpCyqA';
		$t3.access_token_secret = 'YtHHt9xI0ikCG0hwq5HzHAg2t6bF64q4MsESqE6Us';
		ss.add($t1, $t3);
		null;
		var $t4 = new $SqlApi_Credentials();
		$t4.consumer_key = 'P5KR6e8ZxKiY87XQQAd39Q';
		$t4.consumer_secret = 'esh2cw3vfs5kvaNNCeWjx7IVAX7si6z85rlZfmSY';
		$t4.access_token_key = '325955870-0vFjVCoNBElK7EmfkctMpOdmZ1SkLXPj3EvyPhmH';
		$t4.access_token_secret = 'AFxEICma0IiM1C6mYY0kgy4vjvXODLg3lp2Q7F2EFA';
		ss.add($t1, $t4);
		null;
		var $t5 = new $SqlApi_Credentials();
		$t5.consumer_key = 'P0s5R4P8bUltW2UFkuQ';
		$t5.consumer_secret = 'B0jKf4YVnm4aRDyjxT9QiWHD1QGzqAUDRM4s8bf1k8';
		$t5.access_token_key = '80748695-lG15zHRrEWndVeAURLqHt0FgECU9mNIo4pAkxu2wv';
		$t5.access_token_secret = 'znPCZkQXexrR2c2zOKJoCCsDxhIton2un6VPKFvBg';
		ss.add($t1, $t5);
		null;
		var $t6 = new $SqlApi_Credentials();
		$t6.consumer_key = 'hiiz5qRbOA5CDYywFuSOg';
		$t6.consumer_secret = 'jRlw2sskOEWalxMVsBcDo9fSCSjK9hmuYIUAqKpdk';
		$t6.access_token_key = '80748695-xBvHCQadwIaHe3AotZzFw35Q5LG9bpxjys6Zxawjk';
		$t6.access_token_secret = 'ZNrQ03U3qGZQB9vbNcSfHyxnfK2V7SC0bkXQvAAvKE';
		ss.add($t1, $t6);
		null;
		var $t7 = new $SqlApi_Credentials();
		$t7.consumer_key = 'VMfotpGVu4THBiUNaJjKTQ';
		$t7.consumer_secret = 'f6qEWmuFg5AFpTgVLHFmrvutNOO4ulDTU4GW8L00E';
		$t7.access_token_key = '80748695-OWCqpYaEz3PKBkgGioQumbsRLlGO4izeWqj5KPsv1';
		$t7.access_token_secret = 'zFSxreQkaAzK5h6ZShaQhS26BT92H3eRgHJqWkBTOs';
		ss.add($t1, $t7);
		null;
		var $t8 = new $SqlApi_Credentials();
		$t8.consumer_key = 'OSBkZmRwht81gQWUloLjQw';
		$t8.consumer_secret = 'hkmy6bbfRPgYmsXo8suyiyVRxaP1qt1sa8nG7Fg2Q';
		$t8.access_token_key = '80748695-w6K9EG6QlzOODwE0ejHZsSk4IhxbRZV2oLROPr7H2';
		$t8.access_token_secret = 'HW6y9MQ6gPzF8kuyrr11AXmrn4gA0hT4iOPwh73UM';
		ss.add($t1, $t8);
		null;
		var $t9 = new $SqlApi_Credentials();
		$t9.consumer_key = 'SQ1MfzVE9inxcwBJ8n0U2Q';
		$t9.consumer_secret = 'RcV80HDoYaGYFeoNe3vKYyXSGfUUXTQ0qgm5a63NSc';
		$t9.access_token_key = '325955870-pHjF1PAbpmCKHQ2Y0zEeaCQ7bsvEStneiHbErxX6';
		$t9.access_token_secret = 'JFlEk4FahPn8TVUOvIPXel7Xbw4gdTiB0TrwEsP9C5to0';
		ss.add($t1, $t9);
		null;
		var $t10 = new $SqlApi_Credentials();
		$t10.consumer_key = 'Wv2d27GIR6sHzFiVORR6A';
		$t10.consumer_secret = '0tHgcapD5OTrk0iY5FcUrZmlgqyRoXWMSQBIHPAV8sU';
		$t10.access_token_key = '80748695-suC7ka6ZUrTlyzEvitxGzDJtsIylAtTYLa1cIP2uu';
		$t10.access_token_secret = 'wxDBQAqV7NnQR3P7M9bKTznmzlbASUHbNafyR6TBrCMvV';
		ss.add($t1, $t10);
		null;
		var $t11 = new $SqlApi_Credentials();
		$t11.consumer_key = 'av6KEJsgKIkglYDIm7A32Q';
		$t11.consumer_secret = 'tD9rHz3oKPLD6T6aIhnxNR9HC7RNnxk3Bc2C84fc';
		$t11.access_token_key = '2193647586-DEKDIs0wq84zYTm6UovZvtk4EXSWWh704Fmo3Zu';
		$t11.access_token_secret = 'xIsMRdxuir2yV3hUmWJIFIAmSN3AOUCiCIx76XRq3M6Hr';
		ss.add($t1, $t11);
		null;
		var $t12 = new $SqlApi_Credentials();
		$t12.consumer_key = 'GqpSRyR28BimElrqkwfMRw';
		$t12.consumer_secret = 'OrP74LMiHJfnIVC7bZXXeFs7NlHnjxeY5EV7IOK1A';
		$t12.access_token_key = '2193647586-KyVsgmfxVbdWve1kPmN96XVF265YbR3JEJUYttI';
		$t12.access_token_secret = 'POUVQ7Dd71wg99txMeBO8AAhb8h1FUmrYsCyNl7c7dTOS';
		ss.add($t1, $t12);
		null;
		var $t13 = new $SqlApi_Credentials();
		$t13.consumer_key = 'lZrOLP4Qvu0tzmAAVb4jg';
		$t13.consumer_secret = 'NDaR1owctZ0XBItF91BrL2yzXPLfPDwya3kcGHq0VU';
		$t13.access_token_key = '2193647586-RzMuxsv72sz9ayJFQGfk0K8ZFCQx8Ttx1Sr5p0W';
		$t13.access_token_secret = 'guzGJqZbYBp88WsqU8qduwvdmTgHHBBB8WR8UUZ96vzDy';
		ss.add($t1, $t13);
		null;
		var $t14 = new $SqlApi_Credentials();
		$t14.consumer_key = 'arYe2LdCdi221Q8tosprig';
		$t14.consumer_secret = '7nEuddbE3tLnUx9rrxcJoKqAMs5JQPphmTZKNYiyQfE';
		$t14.access_token_key = '2193647586-amsKPSWTGo1GrI101nnLR3bXrnu3iJCUA1TFBeT';
		$t14.access_token_secret = 'wkixFgxY0bwM0uCRqxVxVKA74wxwIqeplw7j1IWY5BtiX';
		ss.add($t1, $t14);
		null;
		var $t15 = new $SqlApi_Credentials();
		$t15.consumer_key = 'EWJbSB8pJTa370RMyrAZA';
		$t15.consumer_secret = 'UF6c8KsuQcdpbViSku71qW2RHc4lDMY8RcSvgdv8gE';
		$t15.access_token_key = '2193647586-0H3wCTjhY7Ot32tYcPjq1UM32P0PmhgYRECYQhT';
		$t15.access_token_secret = 'r9rsAg9HHXuiJ3IPuyit2Bp9Im94NMDnmvw28Dik8KHgI';
		ss.add($t1, $t15);
		null;
		var $t16 = new $SqlApi_Credentials();
		$t16.consumer_key = 'mUsjrObx3OkBh39lie22Dg';
		$t16.consumer_secret = 'QBNh3DZtICRCFmwuUBfJu9o6zZa2QyiiqMFLwmKr00';
		$t16.access_token_key = '2193647586-dffa6txyVkN0DV06Bh9IxTgVqeEG5cmLXXMRbGM';
		$t16.access_token_secret = 'DniaPqqTFaswRA9sxGrXNtBCodpgDnYc1l1bQNBSMmu4X';
		ss.add($t1, $t16);
		null;
		var $t17 = new $SqlApi_Credentials();
		$t17.consumer_key = 'PZ4Fp7L5b0laQMxizoIQ';
		$t17.consumer_secret = 'cKNMsimJhNJNKWcO3q0LeUkYILk7OB574SDIrrOPc';
		$t17.access_token_key = '2193647586-sDfwInLxWfEJs231j9AAi4dOxNv0fTO2DZ1yU8F';
		$t17.access_token_secret = '7UEPTybAAo6xuOu8sNrc5cUaOK9yu9Z9nj3bjIHA0aIUZ';
		ss.add($t1, $t17);
		null;
		var $t18 = new $SqlApi_Credentials();
		$t18.consumer_key = 'gWQUPpuNbMLLETEJn8JqQ';
		$t18.consumer_secret = 'MlsiTRssSsNam1rFBJVTbDBjOegyyBsJHUhzR6wfw';
		$t18.access_token_key = '2193647586-ewFzUc9l61dXT1BBB9LjyY4yyITbjPVQ0HlXAlk';
		$t18.access_token_secret = 'nKU7jsO7YHa5H1mruZwIKjJxYNIfehAhoGmuRFeM5UjJX';
		ss.add($t1, $t18);
		null;
		var $t19 = new $SqlApi_Credentials();
		$t19.consumer_key = 'tgW7jZWpmaFTpIoEriPAHg';
		$t19.consumer_secret = 'aX0O4b6RyKxHrUpgKUIYgJeACNkZd0zbUHTLmNRAY';
		$t19.access_token_key = '2193647586-2rSR4KfpFniBTjFbCYYrEgIKWtET0rSKi6Gac3d';
		$t19.access_token_secret = 'ROXxByEEdduvuIIMZ9i56zvQqiehZ0r28mdLeFVJZHzSg';
		ss.add($t1, $t19);
		null;
		var $t20 = new $SqlApi_Credentials();
		$t20.consumer_key = 'Ek4uywugHAOn3mjLN8ZR1Q';
		$t20.consumer_secret = 'izMQxmb2oeUY3CorqQET3vciK2AJQsywyqKio4ffEM';
		$t20.access_token_key = '2193647586-NBcSBCfWwiVVYT9c1cN09HTBxWRXdD16AkoMl9o';
		$t20.access_token_secret = 'FUPbSi5puOshgiz07PEU7fBgRa6Z5esjtygTVu2NzZnmz';
		ss.add($t1, $t20);
		null;
		var $t21 = new $SqlApi_Credentials();
		$t21.consumer_key = 'Mqr3DW5pLBuSDeTH4ALFA';
		$t21.consumer_secret = 'TfudaEh5Mve98KIU0r32vRfoT1OYxL5hiWqfVT8wYz8';
		$t21.access_token_key = '2193647586-qb4fIaqvj7uCPzmTMnNcu8KorlxNqkyJcXDpgJT';
		$t21.access_token_secret = 'xieyWtztYAlnwjtoh3tvs74sJvkFhSHwmTDp3Set371nP';
		ss.add($t1, $t21);
		null;
		var $t22 = new $SqlApi_Credentials();
		$t22.consumer_key = 'dV6iby0aGuUNxFgOocTcw';
		$t22.consumer_secret = 'X4SnRgpnxnIodW7XA8Ee7JNTQ1myStdC94vuChg1O5c';
		$t22.access_token_key = '2193647586-dK3TqPFdAdUWn9AZGRihbDrpyFzvS4kpDRDsZvC';
		$t22.access_token_secret = 'AbICxujEL17Sk3csOSRAaxbcvkKEDO0vTmNqOcBDemwpH';
		ss.add($t1, $t22);
		null;
		var $t23 = new $SqlApi_Credentials();
		$t23.consumer_key = 'bmHDTPmylkTCrdOpNSi0mA';
		$t23.consumer_secret = 'tGYzj2yqnQWVMyBenS2Uv3C058an1IG8ch7bcRheLc';
		$t23.access_token_key = '2193647586-yUQLqkwb3coRjEwiaiK7x3S4lmUoJYw9VZaK3dw';
		$t23.access_token_secret = 'VJuCHhvs9wrniNtRdMQtirWzH9v4LUKfSGa7IdOlooVQh ';
		ss.add($t1, $t23);
		null;
		var $t24 = new $SqlApi_Credentials();
		$t24.consumer_key = '7MdSA1zCNTOLJ5QhzDUHGw';
		$t24.consumer_secret = 'GKDMEXREoiLQJdqR4Niw0J0UFbAsSWNfcRbogMbBtc';
		$t24.access_token_key = '2193647586-PMfe0ZeYQamY9d4c07s4ayHJXK0wbSCjK2FS1TJ';
		$t24.access_token_secret = 'ED8S0coOfIF82GetHIQBnQVca9U6SgJApgncl95fs98wY';
		ss.add($t1, $t24);
		null;
		var $t25 = new $SqlApi_Credentials();
		$t25.consumer_key = 'BsxKXQ9JCzWYYfR7M6Elw';
		$t25.consumer_secret = 'zvqVO03ghiY3wO8oA6JcWW0woQXgln3XKaZ5IceI4g';
		$t25.access_token_key = '2193647586-sCGNgXMOA9wPctZ478vAi4TclNW1t4pMGLgGCSg';
		$t25.access_token_secret = 'HXZ1B81faXhnbvNg3WQTIcr8LNYnaKdjfRxGeSkdrDsn2';
		ss.add($t1, $t25);
		null;
		var $t26 = new $SqlApi_Credentials();
		$t26.consumer_key = 'Ulj7NDdpNir5XWCScPna6g';
		$t26.consumer_secret = 'XyAQ8sJDDDUrye0qwKxnj3ES33pNM6IGp2sA423Tiy0';
		$t26.access_token_key = '2193647586-YRgmRkoVcLTyqq5PftQyeWr2IkHFg4VESW662T0';
		$t26.access_token_secret = 'm1rHstzNnTyc78hOwN0ovyNwRUwPzLpoe75DAqjHgbKD7';
		ss.add($t1, $t26);
		null;
		var $t27 = new $SqlApi_Credentials();
		$t27.consumer_key = 'JUyQUN781CU1DDM2IQyirw';
		$t27.consumer_secret = 'U9HFlacFI2MsbsxGYzmMJ8UlvRJ68g9SWxBwWa9BDw';
		$t27.access_token_key = '2193647586-ubjAc14rYugC5VCQFAKGi0M8t5hkoDy4XD7zorj';
		$t27.access_token_secret = 'crG1c32y3puDZ99610Br3zvPCgFlpFSFloDIHq6Ewa88E';
		ss.add($t1, $t27);
		null;
		var $t28 = new $SqlApi_Credentials();
		$t28.consumer_key = 'sch3drFCZb1lxpiavsEDg';
		$t28.consumer_secret = '3tR4ydUaCWpcF1Ucv4gULij5MVh1YPLzGrs4fUKVb1E';
		$t28.access_token_key = '2193647586-hmtbvPKQsKz37Yc8ZM6NGgvius9tsJUUfk2xaUS';
		$t28.access_token_secret = 'HcBJD6CW308U9cC0wEEbzajQaAyalM6KaZ39doTvDonLS';
		ss.add($t1, $t28);
		null;
		var $t29 = new $SqlApi_Credentials();
		$t29.consumer_key = 'C384oJc4sgg11bA6mkVqHA';
		$t29.consumer_secret = 'EnbGz844y3fDwe042cA0RkWmf9TQ3tuioIPzoXEMCtg';
		$t29.access_token_key = '2193647586-AgfNpufqPg0NqI99yQQlHJo3aNGiNT3OUwguX12';
		$t29.access_token_secret = 'KAbJ7feM1ZWvB64TkpRO8rJhGaLegJdkPtAVDdFBToQ1U';
		ss.add($t1, $t29);
		null;
		var $t30 = new $SqlApi_Credentials();
		$t30.consumer_key = 'WNJQdUgewVXOxg5wI1rQw';
		$t30.consumer_secret = 'NJspknZfYyMQVNsvATpq0xrkj1cbkWi1c1VHg5WVHWY';
		$t30.access_token_key = '2193647586-INlhLA53rlYmOmspgp56UxfJGYO2T3CRtRxFiPT';
		$t30.access_token_secret = '9Sz37WLuiHjfbMAf5ZQYDzxa7O52IfC2yxnAxtv7SunpC';
		ss.add($t1, $t30);
		null;
		var $t31 = new $SqlApi_Credentials();
		$t31.consumer_key = 'QtUgUjEyyy8g2VJwQTEAHQ';
		$t31.consumer_secret = 'dKcmzoy3wKlb6WoiwRPDzwDTj99UD0h7obsDlc8UC0';
		$t31.access_token_key = '80748695-YKtObjWpUPNumDaFyKx8FfumWXm7v1hkA0w4dfJEv';
		$t31.access_token_secret = 'r6hPSvy73Fd7ISTFZDbaaqgVDBxmROaePBSsag45PF8Ba';
		ss.add($t1, $t31);
		null;
		var $t32 = new $SqlApi_Credentials();
		$t32.consumer_key = 'gVDnRtkQJPiX1OzmpwLdLg';
		$t32.consumer_secret = 'QjvA3BthmCJv4FHuyKfG4YUWRUBFjXVA9xDfLpteg';
		$t32.access_token_key = '80748695-A65sWG7h91QiHpJPNhdeLfTkV4PdSjlaoUpPvAPZh';
		$t32.access_token_secret = 'T1lDVUEVZOhCeyNHC7SXTRBdN5GOkINoi6tvXlXuPT3JN';
		ss.add($t1, $t32);
		null;
		var $t33 = new $SqlApi_Credentials();
		$t33.consumer_key = 'kdrhsadiVAEFrvleMzz5w';
		$t33.consumer_secret = '1jZqeslRJB0wlO43OAt5Tr1zMi2fBAawYuXmqoBk';
		$t33.access_token_key = '80748695-PaUxQgkqz3NbfFE9J326wFXXBmVbTbP4xqEXwQxXD';
		$t33.access_token_secret = '3c8olzn3L8hFjn5IxmCtKAUrAZOHSjADnQnG5B2F4WAQf';
		ss.add($t1, $t33);
		null;
		var $t34 = new $SqlApi_Credentials();
		$t34.consumer_key = 'uibtaXksdjI1oNfiz21LQ';
		$t34.consumer_secret = 'rgbCTvuwrm3ZrRbVUzpXI29oLJ6fzSMRGKNNXUkaFic';
		$t34.access_token_key = '80748695-LZeUG6gnHsevlbeuaUmU4xRqhvYNcMZQYVMAyrnDT';
		$t34.access_token_secret = 'a6NmgOYC4ewSAOZL59wyjMfz32RM8HmrJrc3VwLN9uKt1';
		ss.add($t1, $t34);
		null;
		var $t35 = new $SqlApi_Credentials();
		$t35.consumer_key = 'K4MVWaoRBlJeUWUbNdLgQ';
		$t35.consumer_secret = '8NShEYRGZmMXc0jlWaJ2Juv3YLrxBHJC2G6FQZ8A';
		$t35.access_token_key = '80748695-p0rb7Rifolz7YijsEpPYzmyKFGL9DlwEdHLcMOs72';
		$t35.access_token_secret = 'W9Y26OCFa4o80i5rlMEP1vyXPTJEMlJNY7xLpaDOxxn2g';
		ss.add($t1, $t35);
		null;
		var $t36 = new $SqlApi_Credentials();
		$t36.consumer_key = '8LFAtkWDDtpjvOpfFbCO0A';
		$t36.consumer_secret = 'tSPbTKfsrAXqcEzpMfmlGoEG8KAF64OPYkH23W8k1DQ';
		$t36.access_token_key = '80748695-p5L7QGKXOI0VxByv0VyOVstvRDksDArKbruuj0oKq';
		$t36.access_token_secret = 'W5kg4eItw6Gjf56rq0VpGnVX49A2GHcr8R4NWQ9oczyHA';
		ss.add($t1, $t36);
		null;
		var $t37 = new $SqlApi_Credentials();
		$t37.consumer_key = 'v0pmIHPLTaI4ylTMMINUhw';
		$t37.consumer_secret = 'B2aUaVBkO9jyTuJEHlvKR0Q5kjFus7rmMDocPRqg';
		$t37.access_token_key = '80748695-kaOwY8zhivgCzMBH7aesaKWtNzU2snjOA6mgLj16w';
		$t37.access_token_secret = 'fcdKH62aOr7GIAibBTvMitEpDNv6XsiviHDFUbZqGIxgl';
		ss.add($t1, $t37);
		null;
		var $t38 = new $SqlApi_Credentials();
		$t38.consumer_key = 'Iv1bbzcGp7N8OkyEcH74A';
		$t38.consumer_secret = '0AVvrVITsDGUYWZXHgwYAirzW5NZQEZ27VwWGEJarM';
		$t38.access_token_key = '80748695-aPo106FcLEXNiQiuH5xhUd7RislUpb0pJHbUglimi';
		$t38.access_token_secret = 'g5bq9bn37S6h69gmzXddn6tCroQXUvk93KuIUiQsR0pf0';
		ss.add($t1, $t38);
		null;
		var $t39 = new $SqlApi_Credentials();
		$t39.consumer_key = 'dNm7WBFqHUhkqPD1HY8liA';
		$t39.consumer_secret = 'ol7h9nxt1ExQp5L64YB2hlzRnZNfcmAXj3uOT1o8zVA';
		$t39.access_token_key = '80748695-XSvSXShC5XWt0jQOrPAYx9l38hCEoLvrPY4YlrLBp';
		$t39.access_token_secret = '4LxknxbOLdx6stiXZL3LTJ2vp4p0PigA49jW4e2GKTrJt';
		ss.add($t1, $t39);
		null;
		var $t40 = new $SqlApi_Credentials();
		$t40.consumer_key = 't6NK0R6jpwJlN39JBpCM6g';
		$t40.consumer_secret = 'cck7l9W5BY6LKU6FJWKaflGEe8UWuKy2arGztbhOjE';
		$t40.access_token_key = '80748695-ILIXgPVz5IkXDUe2J72Pz5YqNSOsQ2IVreNQoliw5';
		$t40.access_token_secret = 'q9b9pn4oFQHOnOqNMj3la2EzbtwVI6HdlT92asyvFcbo4';
		ss.add($t1, $t40);
		null;
		var $t41 = new $SqlApi_Credentials();
		$t41.consumer_key = 'GQy45lKvltsTW5YsesGEw';
		$t41.consumer_secret = 'Hs0VWPkLJtn1OBKY59gvx4E5YVBIV793cJ9DyBp14w';
		$t41.access_token_key = '80748695-BUr3n8hxkpHjKGTOlqFhGhR23IkokRTeSgBYt3FyH';
		$t41.access_token_secret = 'qhJni5SDViQYubhhBiEQ7Wy296K0VgXeKM8ZRBCpLPyL5';
		ss.add($t1, $t41);
		null;
		var $t42 = new $SqlApi_Credentials();
		$t42.consumer_key = 'wvNhXZzgM28ELXcamVkbtA';
		$t42.consumer_secret = '7iLKm8F5z5Fbr3SYu9TbrYtiq98lgntatjByy1wGRQ';
		$t42.access_token_key = '80748695-HFkmJGGu1CpuWbryRac0fGjA6418KFYdDxWyAXCTf';
		$t42.access_token_secret = 'IMUNeb3bxU9rmAsv1doGqecJOKRGm9uE6RELDBwm5D0Op';
		ss.add($t1, $t42);
		null;
		var $t43 = new $SqlApi_Credentials();
		$t43.consumer_key = 'rR3k4jTJYSqD3RucsWhOiw';
		$t43.consumer_secret = 'oxqafhBZ3aQIQImV8PIHkubwrxjbkxzoJKbdXacEM0';
		$t43.access_token_key = '80748695-Z4dZelW2Ignd1s27m4nEwHthVhK7wasVFtYor9cow';
		$t43.access_token_secret = 'kF8RGCRXsMcpK28CTFS1cNolq1NtbJKiTNw5SvZTW7sGj';
		ss.add($t1, $t43);
		null;
		var $t44 = new $SqlApi_Credentials();
		$t44.consumer_key = 'yjbVzRSE36BQ7Dd93hVLIg';
		$t44.consumer_secret = 'Sk8g0vKdpW3n2FZg3oxm8HCkRD2NHVl5MikmmrUSpds';
		$t44.access_token_key = '80748695-mqezHZv7TVFmmybnnooK3YJEubpz8AVN7cI5q8NX0';
		$t44.access_token_secret = 'mOpVC9Leb1Xh09adWXFKG3HOPrHy6hlq1zP0bUik7IRri';
		ss.add($t1, $t44);
		null;
		var $t45 = new $SqlApi_Credentials();
		$t45.consumer_key = '4JInpNdRdNnmx81vDjIA';
		$t45.consumer_secret = 'vkY4i5Wg1a0ogsZX4tUuba5Z1fGFbHI8QN3XQcsaUHE';
		$t45.access_token_key = '80748695-2FzZG08q2Jn98htYuPwoiOrcGsu1P0kJ6lfm7TktP';
		$t45.access_token_secret = '0czWF50YcduPUEC70X3cYRFkNSZmkRce9uaz6D6WwSmCY';
		ss.add($t1, $t45);
		null;
		var $t46 = new $SqlApi_Credentials();
		$t46.consumer_key = '6uOeWZQLfP9vwik4msMgw';
		$t46.consumer_secret = 'bNLKLPlcfIYsrZhxuP976QCGyZ1EdHDhtkdVUiuBg';
		$t46.access_token_key = '80748695-fgDID2vfJq0jhLizrMJwoEP6HubRvsdxAtDTNfURI';
		$t46.access_token_secret = 'SQoKGOiHLPCegznks6t9fQjWlPog10iqM5AwlbDztGj5j';
		ss.add($t1, $t46);
		null;
		var $t47 = new $SqlApi_Credentials();
		$t47.consumer_key = '2kXtwynwnUUDexT8N5FaA';
		$t47.consumer_secret = 'YJgfmW6T0dG1eOe0Vh54rdUUrLbkFjcQ70Tg34lGn1E';
		$t47.access_token_key = '80748695-pfo7T194UxqBnW5Awb2MiS2eotumVJgi8WF1NlDzR';
		$t47.access_token_secret = 'Z8DWpBN5weNMpWxcdxIct3CkxP0DqAXgBZgWvlLu42kJS';
		ss.add($t1, $t47);
		null;
		var $t48 = new $SqlApi_Credentials();
		$t48.consumer_key = 't9hZtTfGiYizbSkg9QtHew';
		$t48.consumer_secret = 'bgoOevUYOwZhj8yMwBA0UhaV3ysen9ypEMYHME3Qikw';
		$t48.access_token_key = '80748695-DHSezgHDWJZ3ULcmJv6pjbVKFOombrtTjlPh2Kr9z';
		$t48.access_token_secret = 'YZRtsPl0FRq0WzrJ0q9XDkwuIAMxHM47iugrBbqv6KZv5';
		ss.add($t1, $t48);
		null;
		var $t49 = new $SqlApi_Credentials();
		$t49.consumer_key = 'ESnSFoz6sJcJaVRRzkQ';
		$t49.consumer_secret = 'gxbUppKhWA8J358NcV08XxetNzRyioEEiTRrklZJsM';
		$t49.access_token_key = '80748695-UOPWqmF8NH1NGzvduYVMQJyrvIiWO6IDWQ3ffqUDw';
		$t49.access_token_secret = '2dSjtBUsNQ988uDUhaMRs4FmgIaSVlI5nC5Em1chfbS3J';
		ss.add($t1, $t49);
		null;
		var $t50 = new $SqlApi_Credentials();
		$t50.consumer_key = '9EHRuZcgmpXqX5Z1rL5mgw';
		$t50.consumer_secret = 'Qtt4qlvEX4jHbN9KzMytX8hTnTf8wbY027joS0';
		$t50.access_token_key = '80748695-pzzKIjeOB7tS20yVJtArRuJjMc81zAZYF0oLA6EZT';
		$t50.access_token_secret = 'plRVvb6ix0lfUBS7nsUA72m0ErjAo58JhrfokfYRTpSmy';
		ss.add($t1, $t50);
		null;
		var $t51 = new $SqlApi_Credentials();
		$t51.consumer_key = 'sfxzMSZeddQxbHUuNeqQ';
		$t51.consumer_secret = 'r94LFtYxqC4d8YZ89s0hEWo47ZjuoRvKUGQoYEtSU';
		$t51.access_token_key = '80748695-Q3Zvo7StEpZ8ROXNrBgR99ArJSPpBXUFXLBbukGSv';
		$t51.access_token_secret = '0cOisho5avdcLAM7u1guzr19d7iaJaIr6QBUgivRgCnsd';
		ss.add($t1, $t51);
		null;
		var $t52 = new $SqlApi_Credentials();
		$t52.consumer_key = '1frsF5ocrxPfB0Ee2E4Mw';
		$t52.consumer_secret = 'jgbMGoFObbYv0JvoHt13j6k1oM5vEb8CEYj9L6EOw';
		$t52.access_token_key = '80748695-opcCLSVKtGZvIPIRVZ8wk7WLl3ZPjsmaYU3kHrjBu';
		$t52.access_token_secret = 'lIkj1QJMc2fWLKNvj7wdJF0SsX0n9EzRVV09vwyPIyEea';
		ss.add($t1, $t52);
		null;
		var $t53 = new $SqlApi_Credentials();
		$t53.consumer_key = 'PE3LZww9hXreZbS25RWA';
		$t53.consumer_secret = 'LMkw6pkczo2lZ4cxq0xsTNfOgugB8nyFV7dojZhX4';
		$t53.access_token_key = '80748695-4FK8LH8J2O8r4oxTup2wFE9RdODjtotkvLhRNvkhm';
		$t53.access_token_secret = '33IalV0eqk1AzuzIkb2bX4uablgvQMtx0udIsPxnJw3Eg';
		ss.add($t1, $t53);
		null;
		var $t54 = new $SqlApi_Credentials();
		$t54.consumer_key = 'CTiuHWjqfEyrGI8YA46rNQ';
		$t54.consumer_secret = '6AyxH4fxbIH7FpfVaHnC8tl6v7X4ZrFqmB93NJYo0yU';
		$t54.access_token_key = '80748695-Dcs5utMcp4zPbM7KcYVyGcvA7cbfunjw5zhyEX64v';
		$t54.access_token_secret = '0Dbk9RHVoGI1foooufUUregCbPMON5eJ3WDUjANK4sCqB';
		ss.add($t1, $t54);
		null;
		var $t55 = new $SqlApi_Credentials();
		$t55.consumer_key = 'qpZXcTVNolOxShDt5MxvaA';
		$t55.consumer_secret = 'DyRXTRP4VpG7oCZ1wvuXgRkuPy2IEaALS4MYr5ChE';
		$t55.access_token_key = '80748695-rJEJI7RXv4dpC5hD9xKn4IiN8N7AUZwmKaJ0Yoi32';
		$t55.access_token_secret = 'HJbobnz4qOyQ3MHLQzrLUwqeDsTMyOgnHJFasiu3rX3uH';
		ss.add($t1, $t55);
		null;
		var $t56 = new $SqlApi_Credentials();
		$t56.consumer_key = 'ElVHBWutRrHQdh7E4or5lg';
		$t56.consumer_secret = 'WjGEc9qTiPHduaqplnI7ldaisoFaZBlZjGRgaMRf0';
		$t56.access_token_key = '80748695-m6r07uLNySePTrsATsvCeuIZ8XqHSH8upi02E6SpX';
		$t56.access_token_secret = 'j4BbwUCxrZNlHETvEbupjSq7jraDDWaHGEBBS509kk008';
		ss.add($t1, $t56);
		null;
		var $t57 = new $SqlApi_Credentials();
		$t57.consumer_key = 'TVLxe4cm1qdF9u6V0SKQ1w';
		$t57.consumer_secret = 'Jhta87HH9yAwo0jY0m6ncdZb5fY7PjpEGzOx8dbcyOU';
		$t57.access_token_key = '80748695-Ox4LKy9EVoJMqIMpb7BitN2IU1SSFvfJB2oScvQBA';
		$t57.access_token_secret = 'TUub0uocixDMIZGG3pQPeew4kXL1jgApH286HhwTQt1ek';
		ss.add($t1, $t57);
		null;
		var $t58 = new $SqlApi_Credentials();
		$t58.consumer_key = 'SLpYwgO62gx0CI5kNdVZFA';
		$t58.consumer_secret = 'ECdqoIp75wYeRjpmEoMDdYbGalmiqLCns9lTYO1FJCg';
		$t58.access_token_key = '80748695-QUUJbsv5LHVuo0VChgKz1tU8fJs5wzBY7fCGsK7g4';
		$t58.access_token_secret = 'q5uTfy8Gkyb99v2fEdbImUdcuJMAJ1MaNDjinge1VqhMr';
		ss.add($t1, $t58);
		null;
		var $t59 = new $SqlApi_Credentials();
		$t59.consumer_key = '3rYQCH2jzIdGuu3WpUoM4Q';
		$t59.consumer_secret = 'JDvvFvvrCxvi6x3Z6UzAHQadh8O6ELDT5j6a5fmnI';
		$t59.access_token_key = '80748695-Nk7qktgH7PM7p2d7EpDkoaEemgrJK1k44WBrQdwiZ';
		$t59.access_token_secret = 'NI3bffX6kpnrZnG5TVWuJGgD7RsulA9j4nmjypbaQhKYd';
		ss.add($t1, $t59);
		null;
		var $t60 = new $SqlApi_Credentials();
		$t60.consumer_key = 'bLPrvOps08zPujC6alvA';
		$t60.consumer_secret = '2hBQDa5kf6Ll6oV91UvrncOByHZ48BoT4ZmlCGjdTE';
		$t60.access_token_key = '80748695-AtqA9YEIsh8Ebqsepb6gVWewAumGpNIw2vAq9QMij';
		$t60.access_token_secret = '6vKQg8mHs9w1Zo8gQthaW8G1ZZGxslTai4WWzM2nwjdUy';
		ss.add($t1, $t60);
		null;
		return Enumerable.from($t1).orderBy(function(m) {
			return ss.Guid.newGuid();
		}).toArray();
	};
	exports.SqlApi.TrendsUtils = $SqlApi_TrendsUtils;
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.Tweet
	var $SqlApi_Tweet = function() {
		this.created_at = new Date(0);
		this.tidalServerDate = new Date(0);
		this.text = null;
		this.lang = null;
	};
	$SqlApi_Tweet.__typeName = 'SqlApi.Tweet';
	exports.SqlApi.Tweet = $SqlApi_Tweet;
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.TwitterFactory
	var $SqlApi_TwitterFactory = function() {
	};
	$SqlApi_TwitterFactory.__typeName = 'SqlApi.TwitterFactory';
	exports.SqlApi.TwitterFactory = $SqlApi_TwitterFactory;
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.TwitterTrendsLocation
	var $SqlApi_TwitterTrendsLocation = function() {
		this.name = null;
		this.placeType = null;
		this.url = null;
		this.parentid = 0;
		this.country = null;
		this.woeid = 0;
		this.countryCode = null;
	};
	$SqlApi_TwitterTrendsLocation.__typeName = 'SqlApi.TwitterTrendsLocation';
	exports.SqlApi.TwitterTrendsLocation = $SqlApi_TwitterTrendsLocation;
	////////////////////////////////////////////////////////////////////////////////
	// SqlApi.TwitterTrendsPlaceType
	var $SqlApi_TwitterTrendsPlaceType = function() {
		this.code = 0;
		this.name = null;
	};
	$SqlApi_TwitterTrendsPlaceType.__typeName = 'SqlApi.TwitterTrendsPlaceType';
	exports.SqlApi.TwitterTrendsPlaceType = $SqlApi_TwitterTrendsPlaceType;
	ss.initClass($SqlApi_Credentials, exports, {});
	ss.initClass($SqlApi_Trend, exports, {});
	ss.initClass($SqlApi_TrendsContainer, exports, {});
	ss.initClass($SqlApi_TrendsUtils, exports, {});
	ss.initClass($SqlApi_Tweet, exports, {});
	ss.initClass($SqlApi_TwitterFactory, exports, {});
	ss.initClass($SqlApi_TwitterTrendsLocation, exports, {});
	ss.initClass($SqlApi_TwitterTrendsPlaceType, exports, {});
})();
