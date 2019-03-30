using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using ReversiAPI.Util.Exceptions;

namespace ReversiAPI.Session
{
    public static class UpdateManager
    {
        public static readonly Dictionary<GameSession, ICollection<UpdateType>> GameSessionUpdates = new Dictionary<GameSession, ICollection<UpdateType>>();

        public static void AddSessionUpdate(string sessionId, UpdateType updateCode) => AddSessionUpdate(UserSessionManager.UserSessions[sessionId], updateCode);

        public static void AddSessionUpdate(UserSession session, UpdateType updateCode)
        {
            GameSession gameSession = session.GameSession;

            if (gameSession == null) throw new IllegalStateException();

            if (!GameSessionUpdates.ContainsKey(gameSession)) GameSessionUpdates[gameSession] = new Collection<UpdateType>();

            GameSessionUpdates[gameSession].Add(updateCode);
        }

        //TODO add GlobalUpdateType
//        public static void AddGlobalUpdate(string sessionId, UpdateType updateCode)
//        {
//            GlobalUpdates[sessionId].Add(updateCode);
//        }
    }
}