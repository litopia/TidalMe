using SqlApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Serialization;
using System.Threading.Tasks;
using TwitterApi;

namespace WebsiteModels
{
    public class TweetResult
    {
        public string UserImage;
        public string UserName;
        public string UserScreenName;
        public string Text;
        public string TweetImage;
    }

    public class TwitterTrendingDataModel
    {
        static TwitterTrendingDataModel()
        {
            Initialize();
        }

        static Connection m_Connection;

        const int COUNT_TWEETS = 20;

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

        public void GetLocations(Action<object> callback)
        {
            if (m_Connection == null)
            {
                return;
            }

            Request request = m_Connection.Request();
            request.Query(String.Format(
@"SELECT WoeId, Name
FROM Location
WHERE PlaceTypeCode = 12 OR PlaceTypeCode = 19
ORDER BY Name"), delegate(object err, object recordsets)
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

        public class TwitterTrendingData
        {
            public string Name;
            public int Number;
            public string Tweet;
        }

        public void GetData(Action<object> callback, int woeId, int numDays)
        {
            if (m_Connection == null)
            {
                return;
            }

            Request request = m_Connection.Request();
            request.Query(String.Format(
@"select top 10 Name as name, count(*) as number from TwtrTrendingData
WHERE WoeId = {0} AND DATEDIFF(DAY, time, GETDATE()) <= {1}
GROUP BY Name
ORDER BY count(*) desc", woeId, numDays), async delegate(object err, object[] recordsets)
            {
                if (!Script.IsNullOrUndefined(err))
                {
                    NodeJS.Console.Info("err = " + err);
                    callback(null);
                }
                else
                {
                    List<Task> tasks = new List<Task>();
                    foreach (object record in recordsets)
                    {
                        TwitterTrendingData trendingData = Script.Reinterpret<TwitterTrendingData>(record);
                        SearchOptions so = new SearchOptions
                        {
                            Count = 1,
                            Result_type = "mixed",
                        };

                        // Normalize Trending data
                        trendingData.Number = trendingData.Number * 100 / (numDays * 24 * 6);

                        tasks.Add(FillInTrendingDataWithTweet(trendingData, so));
                    }

                    await Task.WhenAll(tasks);

                    callback(recordsets);                    
                }
            });
        }

        private async Task FillInTrendingDataWithTweet(TwitterTrendingData trendingData, SearchOptions so)
        {
            List<Tweet> tweets = await GetTweetWithRetries(trendingData.Name, so);
            trendingData.Tweet = tweets.First().Text;

            NodeJS.Console.Info("**Finished " + trendingData.Name);
        }

        public async void GetCurrentTweets(Action<object> callback, string query)
        {
            SearchOptions so = new SearchOptions
            {
                Include_entities = true,
                Count = COUNT_TWEETS,
                Result_type = "recent",
            };
            List<Tweet> tweets = await GetTweetWithRetries(query, so);

            if (callback != null)
            {
                JsDictionary<string, object> results = new JsDictionary<string, object>();
                results["tweets"] = tweets.Select(m => new TweetResult()
                {
                    Text = m.Text,
                    UserImage = m.User.ProfileImageUrl,
                    UserName = m.User.Name,
                    UserScreenName = m.User.ScreenName,
                }).Take(20).ToList();
                //results["tweetsPerHour"] = (60 * 60 * 1000) * COUNT_TWEETS / (DateTime.Parse(tweets.First().CreateDate) - DateTime.Parse(tweets.Last().CreateDate));
                NodeJS.Console.Info("Callback for " + query);
                callback(results);
            }
        }

        public async void GetPopularTweetImages(Action<object> callback, string query)
        {
            SearchOptions so = new SearchOptions
            {
                Include_entities = true,
                Count = COUNT_TWEETS,
                Result_type = "popular",
            };
            List<Tweet> tweets = await GetTweetWithRetries(query + " filter:images", so);

            if (callback != null)
            {
                JsDictionary<string, object> results = new JsDictionary<string, object>();
                results["tweets"] = tweets.Select(m => new TweetResult()
                {
                    TweetImage = m.Entities.Media.First().MediaUrl,
                }).Take(20).ToList();
                NodeJS.Console.Info("Callback for " + query);
                callback(results);
            }
        }

        private async Task<List<Tweet>> GetTweetWithRetries(string query, SearchOptions options)
        {
            try
            {
                var x = await TrendsUtils.SearchTweets(TrendsCredentialsUtils.GetNextCredential(), query, options);
                NodeJS.Console.Info("*GetTweetWithRetries query: " + query + "; x=" + x.First().Text);
                return x;
            }
            catch (Exception e)
            {
                
                NodeJS.Console.Info("GetTweetWithRetries exception: " + query + "; ex = " + Json.Stringify(e));

                if (e.Message == "Too Many Requests" ||
                   (e.InnerException != null && e.InnerException.Message == "Too Many Requests"))
                {
                    TrendsCredentialsUtils.InvalidateCredential();
                }
                else
                {
                    throw;
                }
            }

            // Only way to get here is if an Exception is caught but not rethrown
            return await GetTweetWithRetries(query, options);
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