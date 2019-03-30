using System;
using Reversi.Game;
using ReversiAPI.Session;

namespace ReversiAPI.Util
{
    public class GameSessionHelper : IDisposable
    {
        private readonly UserSession session;

        public static bool SessionExists(string sessionId) => UserSessionManager.UserSessions[sessionId].GameSession != null;

        public Game CurrentGame => session.GameSession.Lobby.Game;


        public Player SessionPlayer => session.GameSession.Player;

        public bool SessionPlayerIsCurrentPlayer => SessionPlayer == CurrentGame.CurrentPlayer;

        public GameSessionHelper(string sessionId)
        {
            if (!SessionExists(sessionId)) throw new ArgumentException();

            this.session = UserSessionManager.UserSessions[sessionId];
        }

        public void ClearGame()
        {
            session.GameSession.Lobby = null;
        }

        public void Dispose()
        {
            ClearGame();
        }
    }
}