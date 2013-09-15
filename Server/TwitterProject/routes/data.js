module.exports = function(app) {

    // chat area
    app.get('/data/table', function (req, res) {
        var testData = [];
        var row = { number: 12345, name: "#fashionweek", tweet: "Three @USSoccer fans are clearly ready to qualify for the world cup tonight.  http://instagram.com/hello #worldcup" }
        var rowStr = JSON.stringify(row);

        for (var i = 0; i < 10; i++) {
            testData.push(JSON.parse(rowStr));
        }

        res.json(testData);
    });
}
