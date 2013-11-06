using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.RegularExpressions;
using TwitterApiSalty;

namespace FirehoseEater
{
    class TwitterFirehoseAggregator
    {
        private static Lazy<TwitterFirehoseAggregator> m_Singleton = new Lazy<TwitterFirehoseAggregator>();

        public static TwitterFirehoseAggregator Instance
        {
            get { return m_Singleton.Value; }
        }


        private Dictionary<DateTime, Dictionary<string, int>> m_Dict = new Dictionary<DateTime, Dictionary<string, int>>();
        private TwitterFirehoseAggregator()
        {
            TwitterFirehose.Instance.NewTweets += Instance_NewTweets;
        }

        void Instance_NewTweets(object arg)
        {
            var src = DateTime.UtcNow;
            var hm = new DateTime(src.Year, src.Month, src.Day, src.Hour, src.Minute, 0);

            
        }
    }


    class TwitterFirehose
    {
        private static Lazy<TwitterFirehose> m_Singleton = new Lazy<TwitterFirehose>();

        public static TwitterFirehose Instance
        {
            get { return m_Singleton.Value; }
        }


        public event Action<object> NewTweets;
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

            //string fileName = "Temp.csv";
            //string dataFileName = "TempData.csv";


            //JsDictionary<string, object> options = new JsDictionary<string, object>();
            //options["include-entities"] = true;
            //twit.Get("/statuses/show/27593302936.json", options, delegate(object data)
            //{
            //    Console.Info(Json.Stringify(data));
            //});


            //FS.WriteFileSync(fileName, "{");

            int totalTweets = 0;
            Dictionary<string, int> hashTags = new Dictionary<string, int>();
            DateTime beginningTime = DateTime.Now;
            Regex hashTagMatcher = new Regex(@"[\W](#\w+)", "g");

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

                    if (NewTweets != null)
                    {
                        NewTweets(data);
                    }

                    //FS.AppendFile(dataFileName, Json.Stringify(data));
                    //Console.Info(Json.Stringify(data));

                    //if ((DateTime.Now - beginningTime) < 60 * 1000)
                    //{
                    //    NodeJS.Console.Info("Tweet");
                    //    totalTweets++;
                    //    string text = (string)dataDict["text"];
                    //    var matches = (" " + text).Match(hashTagMatcher);
                    //    if (matches == null || matches.Length == 0)
                    //    {
                    //        return;
                    //    }

                    //    foreach (string match in matches)
                    //    {
                    //        string hashTag = match.Substring(1);
                    //        if (!hashTags.ContainsKey(hashTag))
                    //        {
                    //            hashTags[hashTag] = 0;
                    //        }

                    //        hashTags[hashTag]++;
                    //    }

                    //    //FS.AppendFileSync(fileName, Json.Stringify(data) + ",");
                    //}
                    //else
                    //{
                    //    NodeJS.Console.Info(String.Format("Begin: {0}, End: {1}; Total: {2}", beginningTime, DateTime.Now, totalTweets));
                    //    string concated = String.Join("\r\n", hashTags.OrderByDescending(m => m.Value).Select(m => m.Key + "," + m.Value));
                    //    FS.WriteFileSync(fileName, concated);

                    //    throw new Exception();
                    //}
                });
            });
        }
    }
}
