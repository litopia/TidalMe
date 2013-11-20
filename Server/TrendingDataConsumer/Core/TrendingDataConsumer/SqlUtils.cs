using NodeJS.FSModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Serialization;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TwitterApiSalty;

namespace FirehoseEater
{
    public static class SqlUtils
    {
        public static async Task<Connection> GetSqlConnection()
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
    }
}
