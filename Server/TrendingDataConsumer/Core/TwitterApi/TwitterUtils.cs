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
                new Credentials(){
                    ConsumerKey = "Wv2d27GIR6sHzFiVORR6A",
                    ConsumerSecret = "0tHgcapD5OTrk0iY5FcUrZmlgqyRoXWMSQBIHPAV8sU",
                    AccessTokenKey = "80748695-suC7ka6ZUrTlyzEvitxGzDJtsIylAtTYLa1cIP2uu",
                    AccessTokenSecret = "wxDBQAqV7NnQR3P7M9bKTznmzlbASUHbNafyR6TBrCMvV",                
                },

                //1
                new Credentials(){
                    ConsumerKey = "av6KEJsgKIkglYDIm7A32Q",
                    ConsumerSecret = "tD9rHz3oKPLD6T6aIhnxNR9HC7RNnxk3Bc2C84fc",
                    AccessTokenKey = "2193647586-DEKDIs0wq84zYTm6UovZvtk4EXSWWh704Fmo3Zu",
                    AccessTokenSecret = "xIsMRdxuir2yV3hUmWJIFIAmSN3AOUCiCIx76XRq3M6Hr",                
                },
                //2
                new Credentials(){
                    ConsumerKey = "GqpSRyR28BimElrqkwfMRw",
                    ConsumerSecret = "OrP74LMiHJfnIVC7bZXXeFs7NlHnjxeY5EV7IOK1A",
                    AccessTokenKey = "2193647586-KyVsgmfxVbdWve1kPmN96XVF265YbR3JEJUYttI",
                    AccessTokenSecret = "POUVQ7Dd71wg99txMeBO8AAhb8h1FUmrYsCyNl7c7dTOS",                
                },
                //3
                new Credentials(){
                    ConsumerKey = "lZrOLP4Qvu0tzmAAVb4jg",
                    ConsumerSecret = "NDaR1owctZ0XBItF91BrL2yzXPLfPDwya3kcGHq0VU",
                    AccessTokenKey = "2193647586-RzMuxsv72sz9ayJFQGfk0K8ZFCQx8Ttx1Sr5p0W",
                    AccessTokenSecret = "guzGJqZbYBp88WsqU8qduwvdmTgHHBBB8WR8UUZ96vzDy",                
                },
                //4
                new Credentials(){
                    ConsumerKey = "arYe2LdCdi221Q8tosprig",
                    ConsumerSecret = "7nEuddbE3tLnUx9rrxcJoKqAMs5JQPphmTZKNYiyQfE",
                    AccessTokenKey = "2193647586-amsKPSWTGo1GrI101nnLR3bXrnu3iJCUA1TFBeT",
                    AccessTokenSecret = "wkixFgxY0bwM0uCRqxVxVKA74wxwIqeplw7j1IWY5BtiX",                
                },
                //5
                new Credentials(){
                    ConsumerKey = "EWJbSB8pJTa370RMyrAZA",
                    ConsumerSecret = "UF6c8KsuQcdpbViSku71qW2RHc4lDMY8RcSvgdv8gE",
                    AccessTokenKey = "2193647586-0H3wCTjhY7Ot32tYcPjq1UM32P0PmhgYRECYQhT",
                    AccessTokenSecret = "r9rsAg9HHXuiJ3IPuyit2Bp9Im94NMDnmvw28Dik8KHgI",                
                },
                //6
                new Credentials(){
                    ConsumerKey = "mUsjrObx3OkBh39lie22Dg",
                    ConsumerSecret = "QBNh3DZtICRCFmwuUBfJu9o6zZa2QyiiqMFLwmKr00",
                    AccessTokenKey = "2193647586-dffa6txyVkN0DV06Bh9IxTgVqeEG5cmLXXMRbGM",
                    AccessTokenSecret = "DniaPqqTFaswRA9sxGrXNtBCodpgDnYc1l1bQNBSMmu4X",                
                },
                //7
                new Credentials(){
                    ConsumerKey = "PZ4Fp7L5b0laQMxizoIQ",
                    ConsumerSecret = "cKNMsimJhNJNKWcO3q0LeUkYILk7OB574SDIrrOPc",
                    AccessTokenKey = "2193647586-sDfwInLxWfEJs231j9AAi4dOxNv0fTO2DZ1yU8F",
                    AccessTokenSecret = "7UEPTybAAo6xuOu8sNrc5cUaOK9yu9Z9nj3bjIHA0aIUZ",                
                },
                //8
                new Credentials(){
                    ConsumerKey = "gWQUPpuNbMLLETEJn8JqQ",
                    ConsumerSecret = "MlsiTRssSsNam1rFBJVTbDBjOegyyBsJHUhzR6wfw",
                    AccessTokenKey = "2193647586-ewFzUc9l61dXT1BBB9LjyY4yyITbjPVQ0HlXAlk",
                    AccessTokenSecret = "nKU7jsO7YHa5H1mruZwIKjJxYNIfehAhoGmuRFeM5UjJX",                
                },
                //9
                new Credentials(){
                    ConsumerKey = "tgW7jZWpmaFTpIoEriPAHg",
                    ConsumerSecret = "aX0O4b6RyKxHrUpgKUIYgJeACNkZd0zbUHTLmNRAY",
                    AccessTokenKey = "2193647586-2rSR4KfpFniBTjFbCYYrEgIKWtET0rSKi6Gac3d",
                    AccessTokenSecret = "ROXxByEEdduvuIIMZ9i56zvQqiehZ0r28mdLeFVJZHzSg",                
                },
                //10
                new Credentials(){
                    ConsumerKey = "Ek4uywugHAOn3mjLN8ZR1Q",
                    ConsumerSecret = "izMQxmb2oeUY3CorqQET3vciK2AJQsywyqKio4ffEM",
                    AccessTokenKey = "2193647586-NBcSBCfWwiVVYT9c1cN09HTBxWRXdD16AkoMl9o",
                    AccessTokenSecret = "FUPbSi5puOshgiz07PEU7fBgRa6Z5esjtygTVu2NzZnmz",                
                },
                //11
                new Credentials(){
                    ConsumerKey = "Mqr3DW5pLBuSDeTH4ALFA",
                    ConsumerSecret = "TfudaEh5Mve98KIU0r32vRfoT1OYxL5hiWqfVT8wYz8",
                    AccessTokenKey = "2193647586-qb4fIaqvj7uCPzmTMnNcu8KorlxNqkyJcXDpgJT",
                    AccessTokenSecret = "xieyWtztYAlnwjtoh3tvs74sJvkFhSHwmTDp3Set371nP",                
                },
                //12
                new Credentials(){
                    ConsumerKey = "dV6iby0aGuUNxFgOocTcw",
                    ConsumerSecret = "X4SnRgpnxnIodW7XA8Ee7JNTQ1myStdC94vuChg1O5c",
                    AccessTokenKey = "2193647586-dK3TqPFdAdUWn9AZGRihbDrpyFzvS4kpDRDsZvC",
                    AccessTokenSecret = "AbICxujEL17Sk3csOSRAaxbcvkKEDO0vTmNqOcBDemwpH",                
                },
                //13
                new Credentials(){
                    ConsumerKey = "bmHDTPmylkTCrdOpNSi0mA",
                    ConsumerSecret = "tGYzj2yqnQWVMyBenS2Uv3C058an1IG8ch7bcRheLc",
                    AccessTokenKey = "2193647586-yUQLqkwb3coRjEwiaiK7x3S4lmUoJYw9VZaK3dw",
                    AccessTokenSecret = "VJuCHhvs9wrniNtRdMQtirWzH9v4LUKfSGa7IdOlooVQh ",                
                },
                //14
                new Credentials(){
                    ConsumerKey = "7MdSA1zCNTOLJ5QhzDUHGw",
                    ConsumerSecret = "GKDMEXREoiLQJdqR4Niw0J0UFbAsSWNfcRbogMbBtc",
                    AccessTokenKey = "2193647586-PMfe0ZeYQamY9d4c07s4ayHJXK0wbSCjK2FS1TJ",
                    AccessTokenSecret = "ED8S0coOfIF82GetHIQBnQVca9U6SgJApgncl95fs98wY",                
                },
                //15
                new Credentials(){
                    ConsumerKey = "BsxKXQ9JCzWYYfR7M6Elw",
                    ConsumerSecret = "zvqVO03ghiY3wO8oA6JcWW0woQXgln3XKaZ5IceI4g",
                    AccessTokenKey = "2193647586-sCGNgXMOA9wPctZ478vAi4TclNW1t4pMGLgGCSg",
                    AccessTokenSecret = "HXZ1B81faXhnbvNg3WQTIcr8LNYnaKdjfRxGeSkdrDsn2",                
                },
                //16
                new Credentials(){
                    ConsumerKey = "Ulj7NDdpNir5XWCScPna6g",
                    ConsumerSecret = "XyAQ8sJDDDUrye0qwKxnj3ES33pNM6IGp2sA423Tiy0",
                    AccessTokenKey = "2193647586-YRgmRkoVcLTyqq5PftQyeWr2IkHFg4VESW662T0",
                    AccessTokenSecret = "m1rHstzNnTyc78hOwN0ovyNwRUwPzLpoe75DAqjHgbKD7",                
                },
                //17
                new Credentials(){
                    ConsumerKey = "JUyQUN781CU1DDM2IQyirw",
                    ConsumerSecret = "U9HFlacFI2MsbsxGYzmMJ8UlvRJ68g9SWxBwWa9BDw",
                    AccessTokenKey = "2193647586-ubjAc14rYugC5VCQFAKGi0M8t5hkoDy4XD7zorj",
                    AccessTokenSecret = "crG1c32y3puDZ99610Br3zvPCgFlpFSFloDIHq6Ewa88E",                
                },
                //18
                new Credentials(){
                    ConsumerKey = "sch3drFCZb1lxpiavsEDg",
                    ConsumerSecret = "3tR4ydUaCWpcF1Ucv4gULij5MVh1YPLzGrs4fUKVb1E",
                    AccessTokenKey = "2193647586-hmtbvPKQsKz37Yc8ZM6NGgvius9tsJUUfk2xaUS",
                    AccessTokenSecret = "HcBJD6CW308U9cC0wEEbzajQaAyalM6KaZ39doTvDonLS",                
                },
                //19
                new Credentials(){
                    ConsumerKey = "C384oJc4sgg11bA6mkVqHA",
                    ConsumerSecret = "EnbGz844y3fDwe042cA0RkWmf9TQ3tuioIPzoXEMCtg",
                    AccessTokenKey = "2193647586-AgfNpufqPg0NqI99yQQlHJo3aNGiNT3OUwguX12",
                    AccessTokenSecret = "KAbJ7feM1ZWvB64TkpRO8rJhGaLegJdkPtAVDdFBToQ1U",                
                },
                //20
                new Credentials(){
                    ConsumerKey = "WNJQdUgewVXOxg5wI1rQw",
                    ConsumerSecret = "NJspknZfYyMQVNsvATpq0xrkj1cbkWi1c1VHg5WVHWY",
                    AccessTokenKey = "2193647586-INlhLA53rlYmOmspgp56UxfJGYO2T3CRtRxFiPT",
                    AccessTokenSecret = "9Sz37WLuiHjfbMAf5ZQYDzxa7O52IfC2yxnAxtv7SunpC",                
                },
                //21
                new Credentials(){
                    ConsumerKey = "QtUgUjEyyy8g2VJwQTEAHQ",
                    ConsumerSecret = "dKcmzoy3wKlb6WoiwRPDzwDTj99UD0h7obsDlc8UC0",
                    AccessTokenKey = "80748695-YKtObjWpUPNumDaFyKx8FfumWXm7v1hkA0w4dfJEv",
                    AccessTokenSecret = "r6hPSvy73Fd7ISTFZDbaaqgVDBxmROaePBSsag45PF8Ba",                
                },
                //22
                new Credentials(){
                    ConsumerKey = "gVDnRtkQJPiX1OzmpwLdLg",
                    ConsumerSecret = "QjvA3BthmCJv4FHuyKfG4YUWRUBFjXVA9xDfLpteg",
                    AccessTokenKey = "80748695-A65sWG7h91QiHpJPNhdeLfTkV4PdSjlaoUpPvAPZh",
                    AccessTokenSecret = "T1lDVUEVZOhCeyNHC7SXTRBdN5GOkINoi6tvXlXuPT3JN",                
                },
                //23
                new Credentials(){
                    ConsumerKey = "kdrhsadiVAEFrvleMzz5w",
                    ConsumerSecret = "1jZqeslRJB0wlO43OAt5Tr1zMi2fBAawYuXmqoBk",
                    AccessTokenKey = "80748695-PaUxQgkqz3NbfFE9J326wFXXBmVbTbP4xqEXwQxXD",
                    AccessTokenSecret = "3c8olzn3L8hFjn5IxmCtKAUrAZOHSjADnQnG5B2F4WAQf",                
                },
                //24
                new Credentials(){
                    ConsumerKey = "uibtaXksdjI1oNfiz21LQ",
                    ConsumerSecret = "rgbCTvuwrm3ZrRbVUzpXI29oLJ6fzSMRGKNNXUkaFic",
                    AccessTokenKey = "80748695-LZeUG6gnHsevlbeuaUmU4xRqhvYNcMZQYVMAyrnDT",
                    AccessTokenSecret = "a6NmgOYC4ewSAOZL59wyjMfz32RM8HmrJrc3VwLN9uKt1",                
                },
                //25
                new Credentials(){
                    ConsumerKey = "K4MVWaoRBlJeUWUbNdLgQ",
                    ConsumerSecret = "8NShEYRGZmMXc0jlWaJ2Juv3YLrxBHJC2G6FQZ8A",
                    AccessTokenKey = "80748695-p0rb7Rifolz7YijsEpPYzmyKFGL9DlwEdHLcMOs72",
                    AccessTokenSecret = "W9Y26OCFa4o80i5rlMEP1vyXPTJEMlJNY7xLpaDOxxn2g",                
                },
                //26
                new Credentials(){
                    ConsumerKey = "8LFAtkWDDtpjvOpfFbCO0A",
                    ConsumerSecret = "tSPbTKfsrAXqcEzpMfmlGoEG8KAF64OPYkH23W8k1DQ",
                    AccessTokenKey = "80748695-p5L7QGKXOI0VxByv0VyOVstvRDksDArKbruuj0oKq",
                    AccessTokenSecret = "W5kg4eItw6Gjf56rq0VpGnVX49A2GHcr8R4NWQ9oczyHA",                
                },
                //27
                new Credentials(){
                    ConsumerKey = "v0pmIHPLTaI4ylTMMINUhw",
                    ConsumerSecret = "B2aUaVBkO9jyTuJEHlvKR0Q5kjFus7rmMDocPRqg",
                    AccessTokenKey = "80748695-kaOwY8zhivgCzMBH7aesaKWtNzU2snjOA6mgLj16w",
                    AccessTokenSecret = "fcdKH62aOr7GIAibBTvMitEpDNv6XsiviHDFUbZqGIxgl",                
                },
                //28
                new Credentials(){
                    ConsumerKey = "Iv1bbzcGp7N8OkyEcH74A",
                    ConsumerSecret = "0AVvrVITsDGUYWZXHgwYAirzW5NZQEZ27VwWGEJarM",
                    AccessTokenKey = "80748695-aPo106FcLEXNiQiuH5xhUd7RislUpb0pJHbUglimi",
                    AccessTokenSecret = "g5bq9bn37S6h69gmzXddn6tCroQXUvk93KuIUiQsR0pf0",                
                },
                //29
                new Credentials(){
                    ConsumerKey = "dNm7WBFqHUhkqPD1HY8liA",
                    ConsumerSecret = "ol7h9nxt1ExQp5L64YB2hlzRnZNfcmAXj3uOT1o8zVA",
                    AccessTokenKey = "80748695-XSvSXShC5XWt0jQOrPAYx9l38hCEoLvrPY4YlrLBp",
                    AccessTokenSecret = "4LxknxbOLdx6stiXZL3LTJ2vp4p0PigA49jW4e2GKTrJt",                
                },
                //30
                new Credentials(){
                    ConsumerKey = "t6NK0R6jpwJlN39JBpCM6g",
                    ConsumerSecret = "cck7l9W5BY6LKU6FJWKaflGEe8UWuKy2arGztbhOjE",
                    AccessTokenKey = "80748695-ILIXgPVz5IkXDUe2J72Pz5YqNSOsQ2IVreNQoliw5",
                    AccessTokenSecret = "q9b9pn4oFQHOnOqNMj3la2EzbtwVI6HdlT92asyvFcbo4",                
                },
                //31
                new Credentials(){
                    ConsumerKey = "GQy45lKvltsTW5YsesGEw",
                    ConsumerSecret = "Hs0VWPkLJtn1OBKY59gvx4E5YVBIV793cJ9DyBp14w",
                    AccessTokenKey = "80748695-BUr3n8hxkpHjKGTOlqFhGhR23IkokRTeSgBYt3FyH",
                    AccessTokenSecret = "qhJni5SDViQYubhhBiEQ7Wy296K0VgXeKM8ZRBCpLPyL5",                
                },//32
                new Credentials(){
                    ConsumerKey = "wvNhXZzgM28ELXcamVkbtA",
                    ConsumerSecret = "7iLKm8F5z5Fbr3SYu9TbrYtiq98lgntatjByy1wGRQ",
                    AccessTokenKey = "80748695-HFkmJGGu1CpuWbryRac0fGjA6418KFYdDxWyAXCTf",
                    AccessTokenSecret = "IMUNeb3bxU9rmAsv1doGqecJOKRGm9uE6RELDBwm5D0Op",                
                },
                //33
                new Credentials(){
                    ConsumerKey = "rR3k4jTJYSqD3RucsWhOiw",
                    ConsumerSecret = "oxqafhBZ3aQIQImV8PIHkubwrxjbkxzoJKbdXacEM0",
                    AccessTokenKey = "80748695-Z4dZelW2Ignd1s27m4nEwHthVhK7wasVFtYor9cow",
                    AccessTokenSecret = "kF8RGCRXsMcpK28CTFS1cNolq1NtbJKiTNw5SvZTW7sGj",                
                },
                //34
                new Credentials(){
                    ConsumerKey = "yjbVzRSE36BQ7Dd93hVLIg",
                    ConsumerSecret = "Sk8g0vKdpW3n2FZg3oxm8HCkRD2NHVl5MikmmrUSpds",
                    AccessTokenKey = "80748695-mqezHZv7TVFmmybnnooK3YJEubpz8AVN7cI5q8NX0",
                    AccessTokenSecret = "mOpVC9Leb1Xh09adWXFKG3HOPrHy6hlq1zP0bUik7IRri",                
                },
                //35
                new Credentials(){
                    ConsumerKey = "4JInpNdRdNnmx81vDjIA",
                    ConsumerSecret = "vkY4i5Wg1a0ogsZX4tUuba5Z1fGFbHI8QN3XQcsaUHE",
                    AccessTokenKey = "80748695-2FzZG08q2Jn98htYuPwoiOrcGsu1P0kJ6lfm7TktP",
                    AccessTokenSecret = "0czWF50YcduPUEC70X3cYRFkNSZmkRce9uaz6D6WwSmCY",                
                },//36
                new Credentials(){
                    ConsumerKey = "6uOeWZQLfP9vwik4msMgw",
                    ConsumerSecret = "bNLKLPlcfIYsrZhxuP976QCGyZ1EdHDhtkdVUiuBg",
                    AccessTokenKey = "80748695-fgDID2vfJq0jhLizrMJwoEP6HubRvsdxAtDTNfURI",
                    AccessTokenSecret = "SQoKGOiHLPCegznks6t9fQjWlPog10iqM5AwlbDztGj5j",                
                },//37
                new Credentials(){
                    ConsumerKey = "2kXtwynwnUUDexT8N5FaA",
                    ConsumerSecret = "YJgfmW6T0dG1eOe0Vh54rdUUrLbkFjcQ70Tg34lGn1E",
                    AccessTokenKey = "80748695-pfo7T194UxqBnW5Awb2MiS2eotumVJgi8WF1NlDzR",
                    AccessTokenSecret = "Z8DWpBN5weNMpWxcdxIct3CkxP0DqAXgBZgWvlLu42kJS",                
                },//38
                new Credentials(){
                    ConsumerKey = "t9hZtTfGiYizbSkg9QtHew",
                    ConsumerSecret = "bgoOevUYOwZhj8yMwBA0UhaV3ysen9ypEMYHME3Qikw",
                    AccessTokenKey = "80748695-DHSezgHDWJZ3ULcmJv6pjbVKFOombrtTjlPh2Kr9z",
                    AccessTokenSecret = "YZRtsPl0FRq0WzrJ0q9XDkwuIAMxHM47iugrBbqv6KZv5",                
                },//39
                new Credentials(){
                    ConsumerKey = "ESnSFoz6sJcJaVRRzkQ",
                    ConsumerSecret = "gxbUppKhWA8J358NcV08XxetNzRyioEEiTRrklZJsM",
                    AccessTokenKey = "80748695-UOPWqmF8NH1NGzvduYVMQJyrvIiWO6IDWQ3ffqUDw",
                    AccessTokenSecret = "2dSjtBUsNQ988uDUhaMRs4FmgIaSVlI5nC5Em1chfbS3J",                
                },//40
                new Credentials(){
                    ConsumerKey = "9EHRuZcgmpXqX5Z1rL5mgw",
                    ConsumerSecret = "Qtt4qlvEX4jHbN9KzMytX8hTnTf8wbY027joS0",
                    AccessTokenKey = "80748695-pzzKIjeOB7tS20yVJtArRuJjMc81zAZYF0oLA6EZT",
                    AccessTokenSecret = "plRVvb6ix0lfUBS7nsUA72m0ErjAo58JhrfokfYRTpSmy",                
                },
                //41
                new Credentials(){
                    ConsumerKey = "sfxzMSZeddQxbHUuNeqQ",
                    ConsumerSecret = "r94LFtYxqC4d8YZ89s0hEWo47ZjuoRvKUGQoYEtSU",
                    AccessTokenKey = "80748695-Q3Zvo7StEpZ8ROXNrBgR99ArJSPpBXUFXLBbukGSv",
                    AccessTokenSecret = "0cOisho5avdcLAM7u1guzr19d7iaJaIr6QBUgivRgCnsd",                
                },
                //42
                new Credentials(){
                    ConsumerKey = "1frsF5ocrxPfB0Ee2E4Mw",
                    ConsumerSecret = "jgbMGoFObbYv0JvoHt13j6k1oM5vEb8CEYj9L6EOw",
                    AccessTokenKey = "80748695-opcCLSVKtGZvIPIRVZ8wk7WLl3ZPjsmaYU3kHrjBu",
                    AccessTokenSecret = "lIkj1QJMc2fWLKNvj7wdJF0SsX0n9EzRVV09vwyPIyEea",                
                },
                //43
                new Credentials(){
                    ConsumerKey = "PE3LZww9hXreZbS25RWA",
                    ConsumerSecret = "LMkw6pkczo2lZ4cxq0xsTNfOgugB8nyFV7dojZhX4",
                    AccessTokenKey = "80748695-4FK8LH8J2O8r4oxTup2wFE9RdODjtotkvLhRNvkhm",
                    AccessTokenSecret = "33IalV0eqk1AzuzIkb2bX4uablgvQMtx0udIsPxnJw3Eg",                
                },
                //44
                new Credentials(){
                    ConsumerKey = "CTiuHWjqfEyrGI8YA46rNQ",
                    ConsumerSecret = "6AyxH4fxbIH7FpfVaHnC8tl6v7X4ZrFqmB93NJYo0yU",
                    AccessTokenKey = "80748695-Dcs5utMcp4zPbM7KcYVyGcvA7cbfunjw5zhyEX64v",
                    AccessTokenSecret = "0Dbk9RHVoGI1foooufUUregCbPMON5eJ3WDUjANK4sCqB",                
                },
                //45
                new Credentials(){
                    ConsumerKey = "qpZXcTVNolOxShDt5MxvaA",
                    ConsumerSecret = "DyRXTRP4VpG7oCZ1wvuXgRkuPy2IEaALS4MYr5ChE",
                    AccessTokenKey = "80748695-rJEJI7RXv4dpC5hD9xKn4IiN8N7AUZwmKaJ0Yoi32",
                    AccessTokenSecret = "HJbobnz4qOyQ3MHLQzrLUwqeDsTMyOgnHJFasiu3rX3uH",                
                },
                //46
                new Credentials(){
                    ConsumerKey = "ElVHBWutRrHQdh7E4or5lg",
                    ConsumerSecret = "WjGEc9qTiPHduaqplnI7ldaisoFaZBlZjGRgaMRf0",
                    AccessTokenKey = "80748695-m6r07uLNySePTrsATsvCeuIZ8XqHSH8upi02E6SpX",
                    AccessTokenSecret = "j4BbwUCxrZNlHETvEbupjSq7jraDDWaHGEBBS509kk008",                
                },//47
                new Credentials(){
                    ConsumerKey = "TVLxe4cm1qdF9u6V0SKQ1w",
                    ConsumerSecret = "Jhta87HH9yAwo0jY0m6ncdZb5fY7PjpEGzOx8dbcyOU",
                    AccessTokenKey = "80748695-Ox4LKy9EVoJMqIMpb7BitN2IU1SSFvfJB2oScvQBA",
                    AccessTokenSecret = "TUub0uocixDMIZGG3pQPeew4kXL1jgApH286HhwTQt1ek",                
                },//48
                new Credentials(){
                    ConsumerKey = "SLpYwgO62gx0CI5kNdVZFA",
                    ConsumerSecret = "ECdqoIp75wYeRjpmEoMDdYbGalmiqLCns9lTYO1FJCg",
                    AccessTokenKey = "80748695-QUUJbsv5LHVuo0VChgKz1tU8fJs5wzBY7fCGsK7g4",
                    AccessTokenSecret = "q5uTfy8Gkyb99v2fEdbImUdcuJMAJ1MaNDjinge1VqhMr",                
                },//49
                new Credentials(){
                    ConsumerKey = "3rYQCH2jzIdGuu3WpUoM4Q",
                    ConsumerSecret = "JDvvFvvrCxvi6x3Z6UzAHQadh8O6ELDT5j6a5fmnI",
                    AccessTokenKey = "80748695-Nk7qktgH7PM7p2d7EpDkoaEemgrJK1k44WBrQdwiZ",
                    AccessTokenSecret = "NI3bffX6kpnrZnG5TVWuJGgD7RsulA9j4nmjypbaQhKYd",                
                },
                //50
                new Credentials(){
                    ConsumerKey = "bLPrvOps08zPujC6alvA",
                    ConsumerSecret = "2hBQDa5kf6Ll6oV91UvrncOByHZ48BoT4ZmlCGjdTE",
                    AccessTokenKey = "80748695-AtqA9YEIsh8Ebqsepb6gVWewAumGpNIw2vAq9QMij",
                    AccessTokenSecret = "6vKQg8mHs9w1Zo8gQthaW8G1ZZGxslTai4WWzM2nwjdUy",                
                },


            }.OrderBy(m => Guid.NewGuid()).ToList();
        }
        
        public static async Task<List<Tweet>> SearchTweets(Credentials creds, string query, SearchOptions searchOptions)
        {
            //NodeJS.Console.Info("+SearchTweets for " + query);

            TaskCompletionSource<List<Tweet>> tcs = new TaskCompletionSource<List<Tweet>>();

            var twitter = TwitterFactory.Get();
            var twitterObj = TwitterFactory.Get(twitter, creds);
            
            twitterObj.Search(query, searchOptions, delegate(object data)
            {
                if (data.ToString().IndexOf("Too Many Requests") != -1)
                {
                    // error
                    NodeJS.Console.Info("Search Error: " + data);
                    tcs.SetException(new Exception("Too Many Requests"));
                    return;
                }

                List<Tweet> trendsContainer = Script.Reinterpret<List<Tweet>>(((dynamic)data).statuses);

                //NodeJS.Console.Info("-Finished SearchTweets for " + query + "; data=" + data.ToString());
                tcs.SetResult(trendsContainer);
            });

            return await tcs.Task;
        }
    }
}
