using System;
using System.Collections.Generic;
using System.Text;

namespace FirehoseEater
{
    public static class DictionaryExtensions
    {
        public static Value GetOrConstruct<Key, Value>(this IDictionary<Key, Value> dict, Key key)
        {
            if (dict.ContainsKey(key))
            {
                return dict[key];
            }

            Value val = Activator.CreateInstance<Value>();
            dict[key] = val;

            return dict[key];
        }
    }

    class SaltyUtils
    {

    }
}
