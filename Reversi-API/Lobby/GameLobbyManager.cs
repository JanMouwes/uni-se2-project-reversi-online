using System;
using System.Collections.Generic;
using System.Linq;
using ReversiAPI.Session;

namespace ReversiAPI.Lobby
{
    public static class GameLobbyManager
    {
        private static readonly Dictionary<int, GameLobby> GameLobbies = new Dictionary<int, GameLobby>();//TODO change to WeakReferences?

        public static GameLobby Open()
        {
            int lobbyId = GameLobbies.Any() ? GameLobbies.Select(item => item.Key).Max() + 1 : 1;

            GameLobby gameLobby = new GameLobby()
            {
                Id = lobbyId
            };

            GameLobbies[lobbyId] = gameLobby;

            return gameLobby;
        }


        public static IEnumerable<GameLobby> Active => GameLobbies.Select(item =>
        {
            (int id, GameLobby lobby) = item;
            lobby.Id = id;
            return lobby;
        });

//        public static IEnumerable<GameLobby> Full => gameLobbies.Where(lobby => lobby.Players.Count() == lobby.Game.scenario);FIXME

        public static bool TryGet(int id, out GameLobby gameLobby)
        {
            gameLobby = null;
            if (!GameLobbies.ContainsKey(id)) return false;

            gameLobby = GameLobbies[id];
            return true;
        }
    }
}