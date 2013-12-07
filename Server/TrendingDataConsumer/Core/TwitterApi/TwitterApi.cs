using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace TwitterApi
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
        public extern void Search(string req, object options, Action<object> callback);
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

    public class Tweet
    {
        [ScriptName("created_at")]
        public string CreateDate;

        public string Text;
        public string Lang;
        public bool Retweeted;

        [ScriptName("retweeted_count")]
        public int RetweetedCount;

        public User User;
        public Entities Entities;
    }

    public class User
    {
        public string Lang;
        public string Location;
        public string Name;
        [ScriptName("profile_image_url")]
        public string ProfileImageUrl;
        [ScriptName("screen_name")]
        public string ScreenName;
    }

    public class Entities
    {
        public HashTag[] Hashtags;
        public Media[] Media;
    }

    public class HashTag
    {
        public string Text;
    }

    public class Media
    {
        [ScriptName("id_str")]
        public string Id;

        [ScriptName("media_url")]
        public string MediaUrl;
        public string Type;
        public Sizes Sizes;
    }

    public class Sizes
    {
        public Size Large;
        public Size Medium;
        public Size Small;
        public Size Thumb;
    }

    public class Size
    {
        public int W;
        public int H;
        public string Resize;
    }

    public class SearchOptions
    {
        public string Geocode;
        public string Lang;
        public string Locale;
        public string Result_type;
        public int Count;
        public string Until;
        public bool Include_entities;
    }

    public class TrendsContainer
    {
        [ScriptName("as_of")]
        public DateTime AsOf;

        [ScriptName("created_at")]
        public DateTime CreatedAt;
        public Trend[] Trends;
    }

    public class Trend
    {
        public string Name;
        public string Url;

        [ScriptName("promoted_content")]
        public string PromotedContent;
        public string Query;
        public string Events;
    }

    public class TwitterTrendsLocation
    {
        public string Name;
        public TwitterTrendsPlaceType PlaceType;
        public string Url;
        public int Parentid;
        public string Country;
        public int Woeid;
        public string CountryCode;
    }

    public class TwitterTrendsPlaceType
    {
        public int Code;
        public string Name;
    }
}
