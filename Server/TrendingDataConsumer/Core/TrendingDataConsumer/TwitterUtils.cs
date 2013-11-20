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
    public static class TrendsUtils
    {
        public static async Task<TrendsContainer> GetTrend(Credentials creds, int woeid)
        {
            TaskCompletionSource<TrendsContainer> tcs = new TaskCompletionSource<TrendsContainer>();

            var twitter = TwitterFactory.Get();
            var twitterObj = TwitterFactory.Get(twitter, creds);

            Dictionary<string, int> hashTags = new Dictionary<string, int>();
            DateTime beginningTime = DateTime.Now;

            JsDictionary<string, object> options = new JsDictionary<string, object>();
            options["id"] = woeid;

            twitterObj.Get("/trends/place.json", options, delegate(object data)
            {
                //NodeJS.Console.Info("Requesting Trend: " + Json.Stringify(data));

                if (data.GetType() != typeof(Array))
                {
                    // error
                    if (((dynamic)data).statusCode == 429)
                    {
                        tcs.SetException(new Exception("Too Many Requests"));
                    }
                    else
                    {
                        tcs.SetException(new Exception(data.ToString()));
                    }
                    return;
                }

                object[] dataArray = (object[])data;
                TrendsContainer trendsContainer = Script.Reinterpret<TrendsContainer>(dataArray[0]);

                tcs.SetResult(trendsContainer);
            });

            return await tcs.Task;
        }

        public static async Task<TwitterTrendsLocation[]> GetTrendLocations(Credentials creds)
        {
            TaskCompletionSource<TwitterTrendsLocation[]> tcs = new TaskCompletionSource<TwitterTrendsLocation[]>();

            var twitter = TwitterFactory.Get();
            var twitterObj = TwitterFactory.Get(twitter, creds);

            JsDictionary<string, object> options = new JsDictionary<string, object>();

            twitterObj.Get("/trends/available.json", options, delegate(object data)
            {
                if (data.GetType() != typeof(Array))
                {
                    // error
                    if (((dynamic)data).statusCode == 429)
                    {
                        tcs.SetException(new Exception("Too Many Requests"));
                    }
                    else
                    {
                        tcs.SetException(new Exception(data.ToString()));
                    }
                    return;
                }

                object[] dataArray = (object[])data;
                TwitterTrendsLocation[] trendLocationsContainer = Script.Reinterpret<TwitterTrendsLocation[]>(dataArray);

                tcs.SetResult(trendLocationsContainer);
            });

            return await tcs.Task;
        }
        
        public static List<Credentials> GetValidCredentials()
        {
            return new List<Credentials>()
            {
                new Credentials(){
                    ConsumerKey = "5iaBY1vY49ngNJBMy0vw",
                    ConsumerSecret = "bBx36uscbcaY0h7kX9HktfVzty7Vyb7n0FJcEgw8",
                    AccessTokenKey = "325955870-uePDCtgtivjrOyUnTORwGOXpRlBn3rCC1xAeDOcB",
                    AccessTokenSecret = "Emv6SBI8Yevn5MhiBIsjvJ8Ub5G6lOrU3UylRUoqMgaev",                
                },
                new Credentials(){
                    ConsumerKey = "SCRBMIoNmWZS9Aqo2tNg",
                    ConsumerSecret = "yIXVi2hLqrnRWjFvyRHRgGw5u2XFpJgucT8O7yYFTI",
                    AccessTokenKey = "325955870-7ttUlmgwjgwvRVILUO7aOZ3K65EPJH3El9bpCyqA",
                    AccessTokenSecret = "YtHHt9xI0ikCG0hwq5HzHAg2t6bF64q4MsESqE6Us",                
                },
                new Credentials(){
                    ConsumerKey = "P5KR6e8ZxKiY87XQQAd39Q",
                    ConsumerSecret = "esh2cw3vfs5kvaNNCeWjx7IVAX7si6z85rlZfmSY",
                    AccessTokenKey = "325955870-0vFjVCoNBElK7EmfkctMpOdmZ1SkLXPj3EvyPhmH",
                    AccessTokenSecret = "AFxEICma0IiM1C6mYY0kgy4vjvXODLg3lp2Q7F2EFA",                
                },
                new Credentials(){
                    ConsumerKey = "P0s5R4P8bUltW2UFkuQ",
                    ConsumerSecret = "B0jKf4YVnm4aRDyjxT9QiWHD1QGzqAUDRM4s8bf1k8",
                    AccessTokenKey = "80748695-lG15zHRrEWndVeAURLqHt0FgECU9mNIo4pAkxu2wv",
                    AccessTokenSecret = "znPCZkQXexrR2c2zOKJoCCsDxhIton2un6VPKFvBg",                
                },
                new Credentials(){
                    ConsumerKey = "hiiz5qRbOA5CDYywFuSOg",
                    ConsumerSecret = "jRlw2sskOEWalxMVsBcDo9fSCSjK9hmuYIUAqKpdk",
                    AccessTokenKey = "80748695-xBvHCQadwIaHe3AotZzFw35Q5LG9bpxjys6Zxawjk",
                    AccessTokenSecret = "ZNrQ03U3qGZQB9vbNcSfHyxnfK2V7SC0bkXQvAAvKE",                
                },
                new Credentials(){
                    ConsumerKey = "VMfotpGVu4THBiUNaJjKTQ",
                    ConsumerSecret = "f6qEWmuFg5AFpTgVLHFmrvutNOO4ulDTU4GW8L00E",
                    AccessTokenKey = "80748695-OWCqpYaEz3PKBkgGioQumbsRLlGO4izeWqj5KPsv1",
                    AccessTokenSecret = "zFSxreQkaAzK5h6ZShaQhS26BT92H3eRgHJqWkBTOs",                
                },
                new Credentials(){
                    ConsumerKey = "OSBkZmRwht81gQWUloLjQw",
                    ConsumerSecret = "hkmy6bbfRPgYmsXo8suyiyVRxaP1qt1sa8nG7Fg2Q",
                    AccessTokenKey = "80748695-w6K9EG6QlzOODwE0ejHZsSk4IhxbRZV2oLROPr7H2",
                    AccessTokenSecret = "HW6y9MQ6gPzF8kuyrr11AXmrn4gA0hT4iOPwh73UM",                
                },
                new Credentials(){
                    ConsumerKey = "SQ1MfzVE9inxcwBJ8n0U2Q",
                    ConsumerSecret = "RcV80HDoYaGYFeoNe3vKYyXSGfUUXTQ0qgm5a63NSc",
                    AccessTokenKey = "325955870-pHjF1PAbpmCKHQ2Y0zEeaCQ7bsvEStneiHbErxX6",
                    AccessTokenSecret = "JFlEk4FahPn8TVUOvIPXel7Xbw4gdTiB0TrwEsP9C5to0",                
                },
            }.OrderBy(m => Guid.NewGuid()).ToList();
        }
    }
}
