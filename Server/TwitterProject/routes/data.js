module.exports = function(app) {
	require("mscorlib");
    require("linq");
	var WebsiteModels = require("WebsiteModels");
	var instance = WebsiteModels.WebsiteModels.TwitterTrendingDataModel.getInstance();
	
    // chat area
    app.get('/data/table', function (req, res) {
	
		instance.getData(function(obj){
			res.json(obj);
		}, req.query.location || 1, parseInt(req.query.days));
	
    });
    
    app.get('/data/locations', function (req, res) {
	
		instance.getLocations(function(obj){
			res.json(obj);
		});
	
    });
    
    app.get('/data/tweets/current', function (req, res) {
	
		instance.getCurrentTweets(function(obj){
            console.log('callback');
			res.json(obj);
		}, req.query.query);
	
    });
    
    app.get('/data/tweets/popularImages', function (req, res) {
	
		instance.getPopularTweetImages(function(obj){
            console.log('callback');
			res.json(obj);
		}, req.query.query);
	
    });
}
