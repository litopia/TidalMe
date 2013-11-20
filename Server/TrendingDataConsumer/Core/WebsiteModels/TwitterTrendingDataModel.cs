using SqlApi;
using NodeJS;
using NodeJS.HttpModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using SqlApi;

namespace WebsiteModels
{
    public class TwitterTrendingDataModel
    {
        static TwitterTrendingDataModel()
        {
            Initialize();
        }

        static Connection m_Connection;
        static async void Initialize()
        {
            NodeJS.Console.Log("Initialize");
            m_Connection = await GetSqlConnection();
        }

        public static TwitterTrendingDataModel GetInstance()
        {
            NodeJS.Console.Log("Getting instance");
            return new TwitterTrendingDataModel();
        }

        public void GetData(Action<object> callback)
        {
            if (m_Connection == null)
            {
                return;
            }

            Request request = m_Connection.Request();
            request.Query(String.Format(@"select top 10 Name, count(*) as Score from TwtrTrendingData
WHERE WoeId = 1
GROUP BY Name
ORDER BY count(*) desc"), delegate(object err, object recordsets)
            {
                if (!Script.IsNullOrUndefined(err))
                {
                    NodeJS.Console.Info("err = " + err);
                    callback(null);
                }
                else
                {
                    callback(recordsets);
                }
            });
        }

        internal static async Task<Connection> GetSqlConnection()
        {
            NodeJS.Console.Log("Getting Connection start");

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

            NodeJS.Console.Log("Getting Connection to sql");
            Connection connection = null;
            connection = sql.GetConnection(config, delegate(object err)
            {
                NodeJS.Console.Log("Connection received from sql, err: " + err);

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
    }
}