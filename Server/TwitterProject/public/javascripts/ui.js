// JavaScript Document for UI interaction

$(document).ready(function(e) {



	
	var h = $("#tweet-list").height();
	//$("#tweet-list").css("height", "h");
		
	// Toggle the show more tweet behavior
    $(".expend-botton-down").toggle(function(){
		$("#tweet-list").removeClass("default").addClass("show");
		$(".expend-botton-down > p").first().text("Show Less Tweets");
		$(".expend-botton-down > .glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
	}, function(){
		$("#tweet-list").removeClass("show").addClass("default");
		$(".expend-botton-down > p").first().text("Show More Tweets");
		$(".expend-botton-down > .glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
	})
	
	// Toggle the show more pictures behavior
    $(".expend-botton-up").toggle(function(){
		$("#tweet-list").removeClass("default").addClass("show");
		$(".expend-botton-down > p").first().text("Show Less Tweets");
		$(".expend-botton-down > .glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
	}, function(){
		$("#tweet-list").removeClass("show").addClass("default");
		$(".expend-botton-down > p").first().text("Show More Tweets");
		$(".expend-botton-down > .glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
	})
	
	if($(window).width() <= 992){
		$("#showAnalysis").click(function(){
			$("#content-box, .analysis-box").addClass("active");
		});
		$("#closeAnalysis").click(function(){
			$("#content-box, .analysis-box").removeClass("active");
		});
	}
});


//$(function(a){
//	var height = $(window).height();
//	var headH = $("header").innerHeight();
//	var h = height - headH;
//	$("#ranking-box").css({"height": h + "px", "overflow-y": "scroll"});
//	$("#content-box").css({"height": h + "px", "overflow-y": "hidden"});
//})

