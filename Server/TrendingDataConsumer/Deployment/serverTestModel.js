require("mscorlib");
require("./linq.js");
var WebsiteModels = require("./WebsiteModels.js");
var instance = WebsiteModels.WebsiteModels.TwitterTrendingDataModel.getInstance();

instance.getCurrentTweet(function(data){

for(var i = 0;i<data.length;i++){
    var row = data[i];
    console.log("-row" + i + " : " + row);    
}


}, "#mtvstars");