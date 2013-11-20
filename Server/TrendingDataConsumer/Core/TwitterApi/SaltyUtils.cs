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

    public interface IReadOnlyResetEvent
    {
        void WaitOne(Action callback);
        bool IsSignaled { get; }
    }

    public class ManualResetEvent : IReadOnlyResetEvent
    {
        public bool IsSignaled { get; set; }

        List<Action> m_StoredCallbacks = new List<Action>();

        public void Signal()
        {
            if (IsSignaled)
            {
                return;
            }

            foreach (Action storedCallback in m_StoredCallbacks)
            {
                storedCallback();
            }
            m_StoredCallbacks.Clear();

            IsSignaled = true;
        }

        public void WaitOne(Action callback)
        {
            if (IsSignaled)
            {
                callback();
            }
            else
            {
                m_StoredCallbacks.Add(callback);
            }            
        }

        public void Reset()
        {
            IsSignaled = false;
        }
    }
}
