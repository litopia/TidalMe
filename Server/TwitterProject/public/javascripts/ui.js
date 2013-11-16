// JavaScript Document for UI interaction

$(document).ready(function(e) {
    $(".expend-botton").toggle(function(){
		$("#tweet-list").removeClass("default").addClass("show");
		$(".expend-botton > p").first().text("Show Less Tweets");
		$(".expend-botton > .glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
	}, function(){
		$("#tweet-list").removeClass("show").addClass("default");
		$(".expend-botton > p").first().text("Show More Tweets");
		$(".expend-botton > .glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
	})
});