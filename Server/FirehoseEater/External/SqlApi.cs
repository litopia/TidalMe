using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace TwitterApiSalty
{
    public static class SqlServerFactory
    {
        private static Lazy<Sql> m_Singleton = new Lazy<Sql>(() => Get());

        public static Sql Instance
        {
            get { return m_Singleton.Value; }
        }

        [InlineCode("require('mssql')")]
        private extern static Sql Get();
    }
    
    [IgnoreNamespace]
    [Imported]
    public class Sql
    {
        [InlineCode("new {this}.Connection({config}, {callback})")]
        public extern Connection GetConnection(SqlConfiguration config, Action<object> callback);

#region Types

        [ScriptName("Int")]
        public object Int;

        [ScriptName("DateTime")]
        public object DateTime;

        [ScriptName("NVarChar")]
        public object NVarChar;

#endregion
        //public extern void Stream(string api, Action<object> stream);
    }

    [IgnoreNamespace]
    [Imported]
    public class Connection
    {
        public extern Request Request();
    }

    [IgnoreNamespace]
    [Imported]
    public class Config
    {
    }

    [IgnoreNamespace]
    [Imported]
    public class Request
    {
        public extern void Query(string queryStr, Action<object, object> callback);
        public extern void Query(string queryStr, Action<object, object[]> callback);

        public extern void Input(string inputParam, object type, object value);
        public extern void Output(string outputParam, object type);
        public extern void Execute(string procedure_name, Action<object, object, object> callback);
    }

    [IgnoreNamespace]
    [Imported]
    public class Row
    {
        public extern Row[] Rows { get; }

        public extern object this[int key] { get; }

        //public extern void Stream(string api, Action<object> stream);
    }

    [IgnoreNamespace]
    public class SqlConfiguration
    {
        public string User;
        public string Password;
        public string Server;
        //public string Database;
        //public bool Encrypt;
        public Options Options;

        [ScriptName("debug.packet")]
        public bool DebugPacket;
        [ScriptName("debug.data")]
        public bool DebugData;
        [ScriptName("debug.payload")]
        public bool DebugPayload;
    }

    public class Options
    {
        public bool Encrypt;
        public string Database;
    }
}
