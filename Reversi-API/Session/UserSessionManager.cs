using System;
using System.Collections.Generic;
using System.Linq;
using Reversi.Game;
using ReversiAPI.Lobby;
using ReversiAPI.Model;

namespace ReversiAPI.Session
{
    public class UserSessionManager
    {
        public static Dictionary<string, UserSession> UserSessions;

        public static bool IsValidSessionId(string sessionId) => sessionId != null;

        public static bool SessionExists(string sessionId) => UserSessions.ContainsKey(sessionId);

        public static UserSession OpenSession(string sessionId)
        {
            if (!IsValidSessionId(sessionId)) throw new ArgumentException();
            if (UserSessions.ContainsKey(sessionId)) return UserSessions[sessionId];

            UserSessions[sessionId] = new UserSession(sessionId);
            
            return UserSessions[sessionId];
        }

        public static bool SetSessionGameLobby(string sessionId, GameLobby lobby)
        {
            if (!UserSessions.ContainsKey(sessionId)) return false;

            SetSessionGameLobby(UserSessions[sessionId], lobby);

            return true;
        }

        /// <summary>
        /// Sets user-session's game-lobby and game-session, subscribes to events. Adds user to lobby.
        /// </summary>
        /// <param name="userSession"></param>
        /// <param name="lobby"></param>
        public static bool SetSessionGameLobby(UserSession userSession, GameLobby lobby)
        {
            User user = userSession.User;

            //TODO checks and balances
            userSession.GameSession = new GameSession
            {
                Lobby = lobby
            };
            
            void AddGameEventHandlers(Game game)
            {
                UpdateManager.AddSessionUpdate(userSession, UpdateType.LobbyGame);
                game.MoveMade += move => UpdateManager.AddSessionUpdate(userSession, UpdateType.MoveMade);
                game.PlayerAdded += addedPlayer => UpdateManager.AddSessionUpdate(userSession, UpdateType.GamePlayers);
            }

            if (lobby.Game != null) AddGameEventHandlers(lobby.Game);

            lobby.LobbyGameChanged += AddGameEventHandlers;

            lobby.LobbyUsersChanged += game => UpdateManager.AddSessionUpdate(userSession, UpdateType.LobbyUsers);
            

            if (lobby.Game == null) return false;

            if (!lobby.RegisterUserPlayer(user, out Player player)) return false;
            userSession.GameSession.Player = player;

            return true;
        }
    }
}