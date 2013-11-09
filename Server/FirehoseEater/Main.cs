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

        Globals.SetInterval(ProcessTweetData, 50 * 1000);  // Every 50s
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
        KeyValuePair<DateTime, Dictionary<string, int>> aggregation = TwitterFirehoseAggregator.Instance.GetAvailableAggregation();

        if (aggregation == null)
        {
            return;
        }

        NodeJS.Console.Info("**************************************Sending *****");

        foreach (KeyValuePair<string, int> valKVP in aggregation.Value)
        {
            Request request = m_Connection.Request();
            request.Input("Date", SqlServerFactory.Instance.DateTime, aggregation.Key);
            request.Input("HashTag", SqlServerFactory.Instance.NVarChar, valKVP.Key);
            request.Input("Count", SqlServerFactory.Instance.Int, valKVP.Value);
            request.Execute("InsertRawTrendingData", delegate(object err, object recordsets, object returnValue)
            {
                if (!Script.IsNullOrUndefined(err))
                {
                    NodeJS.Console.Info("err = " + err);
                }
            });
        }


        TwitterFirehoseAggregator.Instance.DeleteAggregateForMinute(aggregation.Key);
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