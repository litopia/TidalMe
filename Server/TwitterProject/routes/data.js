module.exports = function(app) {
	require("mscorlib");
	var WebsiteModels = require("WebsiteModels");
	var instance = WebsiteModels.WebsiteModels.TwitterTrendingDataModel.getInstance();
	
    // chat area
    app.get('/data/table', function (req, res) {
	
		instance.getData(function(obj){
			var testData = [];
			for(var i = 0; i<10; i++){
				var row = {};
				row.number = obj[i].Score;
				row.name = obj[i].Name;
				row.tweet = "Three @USSoccer fans are clearly ready to qualify for the world cup tonight.  http://instagram.com/hello #worldcup";
				testData.push(row);
			}
			
			res.json(testData);
		}, req.query.location || 1);
	
    });
    
    app.get('/data/locations', function (req, res) {
	
		instance.getLocations(function(obj){
			res.json(obj);
		});
	
    });
}
