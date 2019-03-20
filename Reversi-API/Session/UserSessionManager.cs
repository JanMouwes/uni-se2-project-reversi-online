using System;
using System.Collections.Generic;

namespace ReversiAPI.Session
{
    public class UserSessionManager
    {
        public static Dictionary<string, UserSession> UserSessions;

        public static bool IsValidSessionId(string sessionId) => sessionId != null;

        public static bool SessionExists(string sessionId) => UserSessions.ContainsKey(sessionId);
        
        public static void OpenSession(string sessionId)
        {
            if (!IsValidSessionId(sessionId)) throw new ArgumentException();
            if (UserSessions.ContainsKey(sessionId)) throw new ArgumentException();
            
            UserSessions[sessionId] = new UserSession(sessionId);
        }
    }
}