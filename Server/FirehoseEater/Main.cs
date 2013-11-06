using FirehoseEater;
using NodeJS;
using NodeJS.FSModule;
using NodeJS.HttpModule;
using System;
using System.Collections.Generic;
using System.Html;
using System.Linq;
using System.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TwitterApiSalty;

class Program
{
    static Program()
    {
        Main();
    }

    static Connection m_Connection;
    static async void Main()
    {
        LoadFiles();

        m_Connection = await GetSqlConnection();

        TwitterFirehose.Instance.NewTweets += Instance_NewTweets;
    }
    
    static void LoadFiles()
    {
        FileLoader.GetLinq();
        //FileLoader.GetSql();
    }

    static async Task<Connection> GetSqlConnection()
    {
        TaskCompletionSource<object> tcs = new TaskCompletionSource<object>();

        Sql sql = SqlServerFactory.Get();

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

            //var request = connection.Request();
            //request.Query("select 1 as number", delegate(object error, object recordSet) {
            //    Console.Info(Json.Stringify(recordSet));
            //});
        });

        await tcs.Task;

        return connection;
    }

    static void Instance_NewTweets(object arg)
    {
        
    }
}