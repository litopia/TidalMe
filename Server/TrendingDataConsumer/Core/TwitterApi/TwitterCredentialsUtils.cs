using NodeJS.FSModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Serialization;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace TwitterApi
{
    public static class TrendsCredentialsUtils
    {
        static List<Credentials> m_ValidCredentials;

        static TrendsCredentialsUtils()
        {
            m_ValidCredentials = TrendsUtils.GetValidCredentials();
        }

        public static Credentials GetNextCredential()
        {
            return m_ValidCredentials.First();
        }

        public static void InvalidateCredential()
        {
            // Put the invalidated one at the end
            Credentials hold = m_ValidCredentials.First();
            m_ValidCredentials.RemoveAt(0);
            m_ValidCredentials.Add(hold);
        }
    }
}
