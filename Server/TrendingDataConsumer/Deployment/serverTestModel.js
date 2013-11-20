require("mscorlib");
var WebsiteModels = require("./WebsiteModels.js");
var instance = WebsiteModels.WebsiteModels.TwitterTrendingDataModel.getInstance();


setTimeout(function(){
	instance.getData();
}, 10000);
