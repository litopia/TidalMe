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
    }
#endif
}