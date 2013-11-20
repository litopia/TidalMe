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
    /// <summary>
    /// This class is reponsible for managing the consumer keys
    /// </summary>
    class TwitterTrendsAggregator
    {
        private static Lazy<TwitterTrendsAggregator> m_singleton = new Lazy<TwitterTrendsAggregator>(() => new TwitterTrendsAggregator());

        public static TwitterTrendsAggregator Instance
        {
            get { return m_singleton.Value; }
        }

        private object m_Lock = new object();
        private List<Credentials> m_ValidCredentials;
        private static List<int> m_ValidWoeIds = new List<int>() { 1, 23424738, 23424747, 23424748, 23424757, 23424768, 23424775, 23424782, 23424787, 23424800, 23424801, 23424803, 23424819, 23424829, 23424833, 23424834, 23424846, 23424848, 23424853, 23424856, 23424863, 23424868, 23424900, 23424901, 23424908, 23424909, 23424910, 23424916, 23424919, 23424922, 23424923, 23424925, 23424934, 23424936, 23424942, 23424948, 23424950, 23424954, 23424969, 23424975, 23424976, 23424977, 23424982 };
        
        public event Action<int, TrendsContainer> OnTrendsReady;  // woeid

        private TwitterTrendsAggregator()
        {
            m_ValidCredentials = TrendsUtils.GetValidCredentials();

            RequestTrends();
            NodeJS.Globals.SetInterval(()=>RequestTrends(), 9 * 60 * 1000);  // 9 min
        }

        private async Task RequestTrends()
        {
            await Task.WhenAll(m_ValidWoeIds.Select(woeid=>RequestTrend(woeid)));
        }

        private async Task RequestTrend(int woeid)
        {
            NodeJS.Console.Info("Requesting Trend: " + woeid);

            try
            {
                TrendsContainer trendsContainer = await TrendsUtils.GetTrend(GetNextCredential(), woeid);
                
                if (OnTrendsReady != null)
                {
                    OnTrendsReady(woeid, trendsContainer);
                }
            }
            catch (Exception e)
            {
                if (e.Message == "Too Many Requests" ||
                   (e.InnerException != null && e.InnerException.Message == "Too Many Requests"))
                {
                    InvalidateCredential();
                    RequestTrend(woeid);
                    return;
                }
                else
                {
                    throw;
                }
            }
        }

        private Credentials GetNextCredential()
        {
            lock (m_Lock)
            {
                return m_ValidCredentials.First();
            }            
        }

        private void InvalidateCredential()
        {
            lock (m_Lock)
            {
                // Put the invalidated one at the end
                Credentials hold = m_ValidCredentials.First();
                m_ValidCredentials.RemoveAt(0);
                m_ValidCredentials.Add(hold);
            }
        }
    }
}
