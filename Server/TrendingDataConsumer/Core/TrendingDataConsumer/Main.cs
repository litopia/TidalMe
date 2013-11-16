using FirehoseEater;
using NodeJS;
using NodeJS.HttpModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TwitterApiSalty;

class Program
{
#if !TEST
    static Program()
    {
        Main();
    }
#endif

    static Connection m_Connection;
    static async void Main()
    {
        LoadFiles();

        m_Connection = await GetSqlConnection();

        //ProcessTweetData();

        TwitterTrendsAggregator.Instance.OnTrendsReady += OnTrendsReady;

                //for (int i = 0; i < 20; i++)
                //{
                //    NodeJS.Console.Info(i);
                //    try
                //    {
                //        TrendsContainer trendsContainer = await TrendsUtils.GetTrend(creds, 1);
                //        NodeJS.Console.Info(Json.Stringify(trendsContainer));
                //        NodeJS.Console.Info("-----------------------");
                //        NodeJS.Console.Info(Json.Stringify(trendsContainer.Trends[0].Name));
                //    }
                //    catch (Exception e)
                //    {
                //        if (e.Message == "Too Many Requests" ||
                //            (e.InnerException != null && e.InnerException.Message == "Too Many Requests"))
                //        {
                //            NodeJS.Console.Info("Too Many Requests Exception");
                //        }
                //        else
                //        {
                //            NodeJS.Console.Info("Regular Exception: " + e.Message);
                //        }
                        
                //    }
                    
                    
                //}
        

        //Globals.SetInterval(ProcessTweetData, 50 * 1000);  // Every 50s
    }

    static void OnTrendsReady(int woeid, TrendsContainer trendsContainer)
    {
        //NodeJS.Console.Info(String.Format("AsOf{2}  CreatedAt{3}     : woeid ({0})'s first trend is {1}", woeid, String.Join(",", trendsContainer.Trends.Select(trend => trend.Name)), trendsContainer.AsOf, trendsContainer.CreatedAt));
        //foreach (Trend trend in trendsContainer.Trends)
        for (int i = 0; i < trendsContainer.Trends.Length; i++)
        {
            Trend trend = trendsContainer.Trends[i];
            NodeJS.Console.Info("Inserting " + trend.Name + " to sql");

            // Got the trends, now we should send the data to SQL

            Request request = m_Connection.Request();
            request.Query(String.Format("insert TwtrTrendingData (Time, WoeId, Name, Query, Events, PromotedContent, Rank) Values('{0}', {1}, '{2}', '{3}', '{4}', '{5}', {6})",
                                        trendsContainer.CreatedAt, woeid, trend.Name, trend.Query, trend.Events, trend.PromotedContent, i)
                , delegate(object err, object recordsets)
                {
                    if (!Script.IsNullOrUndefined(err))
                    {
                        NodeJS.Console.Info("err = " + err);
                    }
                });
        }
    }

    public static void LoadFiles()
    {
        FileLoader.GetLinq();
        //FileLoader.GetSql();
    }

    internal static async Task<Connection> GetSqlConnection()
    {
        TaskCompletionSource<object> tcs = new TaskCompletionSource<object>();

        Sql sql = SqlServerFactory.Instance;

        //const string connStr = "Driver={SQL Server Native Client 10.0};Server=tcp:z9cfcadmwg.database.windows.net,1433;Database=TidalMe;Uid=tommy@z9cfcadmwg;Pwd={your_password_here};Encrypt=yes;Connection Timeout=30;";
        var config = new SqlConfiguration()
        {
            User = @"Tidal1@z9cfcadmwg.database.windows.net",
            Password = "t1dalw4ve!",
            Server = @"z9cfcadmwg.database.windows.net",
            Options = new Options()
            {
                Encrypt = true,
                Database = "TidalMe",
            },
        };

        Connection connection = null;
        connection = sql.GetConnection(config, delegate(object err)
        {
            if (!Script.IsNullOrUndefined(err))
            {
                tcs.SetException(new Exception("Error Received: " + err));
                return;
            }

            tcs.SetResult(err);
        });

        await tcs.Task;

        return connection;
    }

    static void ProcessTweetData()
    {
        Credentials creds = new Credentials()
        {
            ConsumerKey = "5iaBY1vY49ngNJBMy0vw",
            ConsumerSecret = "bBx36uscbcaY0h7kX9HktfVzty7Vyb7n0FJcEgw8",
            AccessTokenKey = "325955870-uePDCtgtivjrOyUnTORwGOXpRlBn3rCC1xAeDOcB",
            AccessTokenSecret = "Emv6SBI8Yevn5MhiBIsjvJ8Ub5G6lOrU3UylRUoqMgaev",
        };

        var twitter = TwitterFactory.Get();
        var twitterObj = TwitterFactory.Get(twitter, creds);

        NodeJS.Console.Info("Before GET");

        JsDictionary<string, object> options = new JsDictionary<string,object>();
        options["id"] = 1;

        twitterObj.Get("/trends/place.json", options, delegate(object data)
        {
            NodeJS.Console.Info(Json.Stringify(data));
        });

        // USEFUL
        // curl --get 'https://api.twitter.com/1.1/search/tweets.json' --data 'filter=images&mode=photos&q=%23InitialsOfSomeoneSpecial&src=tren' --header 'Authorization: OAuth oauth_consumer_key="SCRBMIoNmWZS9Aqo2tNg", oauth_nonce="a7d4e9f251984c1ddcb88f680c6c11db", oauth_signature="z6Ml714ukb5DgNEKcihf5rbdFuI%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1384129430", oauth_token="325955870-7ttUlmgwjgwvRVILUO7aOZ3K65EPJH3El9bpCyqA", oauth_version="1.0"' --verbose
    }

    static void Dummy()
    {
        Http.CreateServer((req, res) =>
        {
            res.Write("Hello, world");
            res.End();
        }).Listen(8000);
    }
}