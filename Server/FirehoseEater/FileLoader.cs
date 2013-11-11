using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

namespace FirehoseEater
{
    class FileLoader
    {
        [InlineCode("require('./linq.js')")]
        public extern static object GetLinq();

        [InlineCode("require('./sql.js')")]
        public extern static object GetSql();
    }
}
