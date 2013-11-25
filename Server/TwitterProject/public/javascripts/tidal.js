var socket = null;

$(function () {
    var m_DaysToLookBack = 1;
    var m_CurrentWoeId = 1;

    function GetDataTable(location, days){
        $.ajax({
            url: "/data/table?days=" + days + "&location=" + location,
            success: function (data, status) {
                console.info("status: " + status);
                console.info(JSON.stringify(data));
                
                d3.selectAll("#ranking-box ul li").remove();

                var li = d3.select("#ranking-box ul").selectAll("li").data(data)
                    .enter().append("li").classed("clearfix", true)
                    .on("click", function(ev){
                        UpdateTweetListFromClick(ev, d3.select(this));
                    });
                

                li.append("span").classed("testrank col-xs-3", true).append("h4").text(function (data) { return data.number + "/100"; });
                var longSpan = li.append("span").classed("col-xs-9", true);
                longSpan.append("h3").text(function (data) { return data.name; });
                longSpan.append("p").text(function (data) { return data.tweet; });

                $("#ranking-box ul li:first-child").addClass("active");
                $('#ranking-box li:first-child').click();                
            }
        });
    }
    
    function GetDataLocations(){
        $.ajax({
            url: "/data/locations",
            success: function (data, status) {
                console.info("status: " + status);
                console.info(JSON.stringify(data));

                var li = d3.select(".locationSelector .dropdown-menu").selectAll("li.appended").data(data)
                    .enter()
                    .append("li").classed("clearfix", true)
                        .attr("name", function(ev){return ev.Name;})
                        .on("click", function(ev){
                            m_CurrentWoeId = ev.WoeId;
                            console.info(ev.WoeId + " " + ev.Name);
                            GetDataTable(m_CurrentWoeId, m_DaysToLookBack);
                            d3.select(".locationSelector .display").text(ev.Name);
                        })
                    .append("a").attr("href", "#").text(function(ev){return ev.Name;});
                
            }
        });
    }
    
    function SetTimeSelectorOptions(){
        var li = d3.select(".timeSelector .dropdown-menu").selectAll("li.appended").data([1,2,3,4,5,6,7])
                    .enter()
                    .append("li").classed("clearfix", true)
                        .on("click", function(ev){
                            m_DaysToLookBack = ev;
                            GetDataTable(m_CurrentWoeId, m_DaysToLookBack);
                            d3.select(".timeSelector .display").text(ev + " days");
                        })
                    .append("a").attr("href", "#").text(function(ev){return ev + " days";});
    }
    
    function UpdateTweetListFromClick(data, d3Elem){
        d3.selectAll("#ranking-box ul li").classed('active', false);
        d3Elem.classed('active', true);
        
        $("#content-box .update-header h3").text(data.name);
        
        // Query from Server
        GetTweetListFromServer(data.name);
        GetImageListFromServer(data.name);
    }
    
    function GetTweetListFromServer(query){
        $.ajax({
            url: "/data/tweets/current?query=" + encodeURIComponent(query),
            success: function (data, status) {
                console.info("status: " + status);
                console.info(JSON.stringify(data));
                
                d3.selectAll("#tweet-list li").remove();

                var li = d3.select("#tweet-list").selectAll("li").data(data.tweets)
                    .enter()
                    .append("li").classed("clearfix", true);
                li.append('img').attr('src', function(ev){ return ev.userImage; } )
                    .classed("col-xs-2", true);
                var spans = li.append('span')
                    .classed('col-xs-10', true);
                var userPs = spans.append('p');
                userPs.append('span')
                    .classed('user-name', true)
                    .text(function(ev){return ev.userName;});
                userPs.append('span')
                    .classed('twitter-id', true)
                    .text(function(ev){return "@" + ev.userScreenName;});
                spans.append('p')
                    .classed('tweet', true)
                    .text(function(ev){return ev.text;});                
            }
        });
    }
    
    function GetImageListFromServer(query){
    
        d3.selectAll(".img-box ul li").remove();
        
        $.ajax({
            url: "/data/tweets/popularImages?query=" + encodeURIComponent(query),
            success: function (data, status) {
                console.info("status: " + status);
                console.info(JSON.stringify(data));
                
                var li = d3.select(".img-box ul").selectAll("li").data(data.tweets)
                    .enter()
                    .append("li").classed("clearfix", true);
                li.append('img').attr('src', function(ev){ return ev.tweetImage; } );
            }
        });
    }
    
    SetTimeSelectorOptions();
    GetDataTable(m_CurrentWoeId, m_DaysToLookBack);
    GetDataLocations();
});