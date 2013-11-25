using NodeJS.FSModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Serialization;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using SqlApi;
using TwitterApi;

namespace SqlApi
{
    /// <summary>
    /// This class is reponsible for managing the consumer keys
    /// </summary>
    class TwitterLocations
    {
        private static Lazy<TwitterLocations> m_singleton = new Lazy<TwitterLocations>(() => new TwitterLocations());

        public static TwitterLocations Instance
        {
            get { return m_singleton.Value; }
        }

        static TwitterLocations()
        {
            //Instance.RequestLocations();
        }

        //internal static TwitterTrendsAggregator GetTestInstance(ITwitterFirehose firehose)
        //{
        //    return new TwitterTrendsAggregator(firehose);
        //}


        //private Dictionary<DateTime, Dictionary<string, int>> m_Dict = new Dictionary<DateTime, Dictionary<string, int>>();
        private object m_Lock = new object();
        private List<Credentials> m_ValidCredentials;

        private ManualResetEvent m_LocationsRetrievedEvent = new ManualResetEvent();
        public IReadOnlyResetEvent LocationsRetrievedEvent { get { return m_LocationsRetrievedEvent; } }
        
        private TwitterLocations()
        {
            m_ValidCredentials = TrendsUtils.GetValidCredentials();
        }
        
        private async Task RequestLocations()
        {
            NodeJS.Console.Info("Requesting Locations");

            try
            {
                TwitterTrendsLocation[] trendsContainer = await TrendsUtils.GetTrendLocations(GetNextCredential());

                foreach (TwitterTrendsLocation loc in trendsContainer)
                {
                    NodeJS.Console.Info("Inserting " + loc.Name + " to sql");

                    // Got the trends, now we should send the data to SQL
                    Connection sqlConnection = await SqlUtils.GetSqlConnection();
                    Request request = sqlConnection.Request();
                    request.Query(String.Format("insert Location (WoeId, Country, CountryCode, Name, ParentId, PlaceTypeCode, Url) Values({0}, '{1}', '{2}', '{3}', {4}, {5}, '{6}')",
                                                loc.Woeid, loc.Country, loc.CountryCode, loc.Name, loc.Parentid, loc.PlaceType.Code, loc.Url)
                        , delegate(object err, object recordsets)
                        {
                            if (!Script.IsNullOrUndefined(err))
                            {
                                NodeJS.Console.Info("err = " + err);
                            }
                        });
                }

                

                m_LocationsRetrievedEvent.Signal();
            }
            catch (Exception e)
            {
                if (e.Message == "Too Many Requests" ||
                   (e.InnerException != null && e.InnerException.Message == "Too Many Requests"))
                {
                    InvalidateCredential();
                    RequestLocations();
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
