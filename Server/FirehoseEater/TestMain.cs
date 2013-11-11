using FirehoseEater;
using NodeJS;
using NodeJS.HttpModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Serialization;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using TwitterApiSalty;

class TestProgram
{
#if TEST
    static TestProgram()
    {
        Program.LoadFiles();
        RunTests();
    }
#endif

    static async void RunTests()
    {
        NodeJS.Console.Info(String.Format("Test1: {0}", Test1()));
        NodeJS.Console.Info(String.Format("Test2: {0}", Test2()));
        NodeJS.Console.Info(String.Format("Test3: {0}", await Test3()));
    }

    static bool Test1()
    {
        var matches = TwitterFirehoseAggregator.GetMatches("#4YearsOfAPKGK love love love &lt;3 http://t.co/IDCRjXanvg");

        if (matches == null && matches.Length != 1)
        {
            return false;
        }

        return matches[0] == " #4YearsOfAPKGK";
    }

    static bool Test2()
    {
        TestTwitterFirehose firehose = TestTwitterFirehose.Instance;
        var aggregator = TwitterFirehoseAggregator.GetTestInstance(firehose);

        firehose.TriggerNewTweets(new Tweet() { TidalServerDate = DateTime.UtcNow, Lang = "en", Text = "#123 hello world" });
        if (aggregator.GetAvailableAggregation() != null)
        {
            return false;
        }

        firehose.TriggerNewTweets(new Tweet() { TidalServerDate = DateTime.Today, Lang = "en", Text = "#234 bye bye" });
        KeyValuePair<DateTime, Dictionary<string, int>> returnVal = aggregator.GetAvailableAggregation();
        if (!(returnVal.Key == DateTime.Today &&
            returnVal.Value.Count == 1 &&
            returnVal.Value.First().Key == "#234" &&
            returnVal.Value.First().Value == 1))
        {
            return false;
        }

        firehose.TriggerNewTweets(new Tweet() { TidalServerDate = DateTime.Today, Lang = "en", Text = "hi #234 hi #234" });
        KeyValuePair<DateTime, Dictionary<string, int>> returnVal2 = aggregator.GetAvailableAggregation();
        if (!(returnVal2.Key == DateTime.Today &&
            returnVal2.Value.Count == 1 &&
            returnVal2.Value.First().Key == "#234" &&
            returnVal2.Value.First().Value == 3))
        {
            return false;
        }

        aggregator.DeleteAggregateForMinute(DateTime.Today);
        if (aggregator.GetAvailableAggregation() != null)
        {
            return false;
        }

        aggregator.Reset();

        return true;
    }

    static async Task<bool> Test3()
    {
        Connection conn = await Program.GetSqlConnection();

        TaskCompletionSource<bool> tcs = new TaskCompletionSource<bool>();
        DateTime date = DateTime.UtcNow.AddYears(100);
        Request request = conn.Request();
        request.Input("Date", SqlServerFactory.Instance.DateTime, date);
        request.Input("HashTag", SqlServerFactory.Instance.NVarChar, "#HELLOWORLD");
        request.Input("Count", SqlServerFactory.Instance.Int, 50);
        request.Execute("InsertRawTrendingData", delegate(object err, object recordsets, object returnValue)
        {
            if (!Script.IsNullOrUndefined(err))
            {
                NodeJS.Console.Info("err = " + err);
            }
            tcs.SetResult(true);
        });

        await tcs.Task;

        TaskCompletionSource<bool> tcs1a = new TaskCompletionSource<bool>();
        DateTime date1a = DateTime.UtcNow.AddYears(101);
        Request request1a = conn.Request();
        request1a.Input("Date", SqlServerFactory.Instance.DateTime, date1a);
        request1a.Input("HashTag", SqlServerFactory.Instance.NVarChar, "#HELLOWORLD");
        request1a.Input("Count", SqlServerFactory.Instance.Int, 50);
        request1a.Execute("InsertRawTrendingData", delegate(object err, object recordsets, object returnValue)
        {
            if (!Script.IsNullOrUndefined(err))
            {
                NodeJS.Console.Info("err = " + err);
            }
            tcs1a.SetResult(true);
        });

        await tcs1a.Task;


        TaskCompletionSource<bool> tcs2 = new TaskCompletionSource<bool>();
        Request request2 = conn.Request();
        request2.Query(String.Format("select * from TrendingData where HashTag = '{0}' AND Count = {1}", "#HELLOWORLD", 50),
            delegate(object err, object[] recordSet)
            {
                if (!Script.IsNullOrUndefined(err))
                {
                    NodeJS.Console.Info("err = " + err);
                }
                tcs2.SetResult(recordSet.Length == 2);
            });

        if (!(await tcs2.Task))
        {
            return false;
        }

        TaskCompletionSource<bool> tcs3 = new TaskCompletionSource<bool>();
        Request request3 = conn.Request();
        request3.Query(String.Format("delete from TrendingData where HashTag = '{0}' AND Count = {1}", "#HELLOWORLD", 50),
            delegate(object err, object recordSet)
            {
                if (!Script.IsNullOrUndefined(err))
                {
                    NodeJS.Console.Info("err = " + err);
                }
                tcs3.SetResult(true);
            });


        return true;
    }
}

class TestTwitterFirehose : ITwitterFirehose
{
    private static Lazy<TestTwitterFirehose> m_Singleton = new Lazy<TestTwitterFirehose>(() => new TestTwitterFirehose());

    public static TestTwitterFirehose Instance
    {
        get { return m_Singleton.Value; }
    }

    public event Action<Tweet> NewTweets;
    public void TriggerNewTweets(Tweet tweet)
    {
        NewTweets(tweet);
    }

    private TestTwitterFirehose()
    {
        
    }
}