using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace TwitterApiSalty
{
    public static class TwitterFactory
    {
        [InlineCode("require('twitter')")]
        public extern static object Get();
        
        [InlineCode("new {obj}({creds})")]
        public extern static Twitter Get(object obj, Credentials creds);
    }
    
    [IgnoreNamespace]
    [Imported]
    public class Twitter
    {
        public extern void Get(string req, JsDictionary<string, object> options, Action<object> callback);
        public extern void Stream(string req, Action<Stream> callback);
    }

    [IgnoreNamespace]
    [Imported]
    public class Stream
    {
        public extern void On(string req, Action<object> callback);
    }

    public class Credentials
    {
        [ScriptName("consumer_key")]
        public string ConsumerKey;
        [ScriptName("consumer_secret")]
        public string ConsumerSecret;
        [ScriptName("access_token_key")]
        public string AccessTokenKey;
        [ScriptName("access_token_secret")]
        public string AccessTokenSecret;
    }
}
