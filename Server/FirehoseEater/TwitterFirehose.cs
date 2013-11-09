using NodeJS.FSModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Serialization;
using System.Text;
using System.Text.RegularExpressions;
using TwitterApiSalty;

namespace FirehoseEater
{
    class TwitterFirehoseAggregator
    {
        private static Regex s_HashTagMatcher = new Regex(@"[\W](#\w+)", "g");

        private static Lazy<TwitterFirehoseAggregator> m_Singleton = new Lazy<TwitterFirehoseAggregator>(()=>new TwitterFirehoseAggregator(TwitterFirehose.Instance));

        public static TwitterFirehoseAggregator Instance
        {
            get { return m_Singleton.Value; }
        }

        internal static TwitterFirehoseAggregator GetTestInstance(ITwitterFirehose firehose)
        {
            return new TwitterFirehoseAggregator(firehose);
        }


        private Dictionary<DateTime, Dictionary<string, int>> m_Dict = new Dictionary<DateTime, Dictionary<string, int>>();
        private TwitterFirehoseAggregator(ITwitterFirehose firehose)
        {
            firehose.NewTweets += TwitterFirehoseNewTweets;
        }

        void TwitterFirehoseNewTweets(Tweet tweet)
        {
            var src = tweet.TidalServerDate;
            var utcNowInMinute = new DateTime(src.Year, src.Month, src.Day, src.Hour, src.Minute, 0);

            var matches = GetMatches(" " + tweet.Text);
            if (matches == null || matches.Length == 0)
            {
                return;
            }

            foreach (string match in matches)
            {
                string hashTag = match.Substring(1);
                m_Dict.GetOrConstruct(utcNowInMinute).GetOrConstruct(hashTag);

                m_Dict.GetOrConstruct(utcNowInMinute)[hashTag]++;
            }
        }

        internal static string[] GetMatches(string text)
        {
            return (" " + text).Match(s_HashTagMatcher);
        }

        public KeyValuePair<DateTime, Dictionary<string, int>> GetAvailableAggregation()
        {
            var src = DateTime.UtcNow;
            var utcLastMinuteInMinute = new DateTime(src.Year, src.Month, src.Day, src.Hour, src.Minute - 1, 0);

            //return m_Dict.FirstOrDefault();  // TODO: delete
            return m_Dict.FirstOrDefault(m=>m.Key <= utcLastMinuteInMinute);
        }

        public void DeleteAggregateForMinute(DateTime date)
        {
            m_Dict.Remove(date);
        }

        internal void Reset()
        {
            m_Dict.Clear();
        }
    }

    public interface ITwitterFirehose
    {
        event Action<Tweet> NewTweets;
    }

    class TwitterFirehose : ITwitterFirehose
    {
        private static Lazy<TwitterFirehose> m_Singleton = new Lazy<TwitterFirehose>(() => new TwitterFirehose());

        public static TwitterFirehose Instance
        {
            get { return m_Singleton.Value; }
        }
        
        public event Action<Tweet> NewTweets;
        private Twitter m_TwitterObj;

        private TwitterFirehose()
        {
            var twitter = TwitterFactory.Get();
            Credentials creds = new Credentials()
            {
                ConsumerKey = "5iaBY1vY49ngNJBMy0vw",
                ConsumerSecret = "bBx36uscbcaY0h7kX9HktfVzty7Vyb7n0FJcEgw8",
                AccessTokenKey = "325955870-uePDCtgtivjrOyUnTORwGOXpRlBn3rCC1xAeDOcB",
                AccessTokenSecret = "Emv6SBI8Yevn5MhiBIsjvJ8Ub5G6lOrU3UylRUoqMgaev",
            };
            m_TwitterObj = TwitterFactory.Get(twitter, creds);

            Dictionary<string, int> hashTags = new Dictionary<string, int>();
            DateTime beginningTime = DateTime.Now;

            m_TwitterObj.Stream("statuses/sample", delegate(Stream stream)
            {
                stream.On("data", delegate(object data)
                {
                    var dataDict = JsDictionary<string, object>.GetDictionary(data);
                    if (dataDict.ContainsKey("delete"))
                    {
                        // Ignore deletes
                        return;
                    }

                    var tweet = Script.Reinterpret<Tweet>(data);
                    if (tweet.Lang != "en")
                    {
                        // Only accept english for now
                        return;
                    }

                    tweet.TidalServerDate = DateTime.UtcNow;

                    if (NewTweets != null)
                    {
                        NewTweets(tweet);
                    }
                });
            });
        }
    }
}
