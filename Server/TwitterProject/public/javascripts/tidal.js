var socket = null;

$(function () {
    $.ajax({
        url: "/data/table?scope=WA",
        success: function (data, status) {
            console.info("status: " + status);
            console.info(JSON.stringify(data));

            var li = d3.select("#ranking-box ul").selectAll("li").data(data)
                .enter().append("li").classed("clearfix", true);

            li.append("span").classed("testrank col-xs-3", true).append("h4").text(function (data) { return data.number; });
            var longSpan = li.append("span").classed("col-xs-9", true);
            longSpan.append("h3").text(function (data) { return data.name; });
            longSpan.append("p").text(function (data) { return data.tweet; });
        }
    });

});