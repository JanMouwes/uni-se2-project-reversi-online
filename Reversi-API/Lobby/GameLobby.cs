using System.Collections.Generic;
using System.Linq;
using Reversi.Game;
using ReversiAPI.Model;

namespace ReversiAPI.Lobby
{
    public delegate void LobbyGameChangedDelegate(Game game);

    public delegate void LobbyUsersChangedDelegate(User user);

    public class GameLobby
    {
        public event LobbyGameChangedDelegate LobbyGameChanged;
        public event LobbyUsersChangedDelegate LobbyUsersChanged;

        public int Id;

        private Game game;

        public Game Game
        {
            get => game;
            set
            {
                game = value;
                LobbyGameChanged?.Invoke(game);
            }
        }

        private IEnumerable<Player> AvailablePlayers => from player in Game.Players.Values
            where !players.ContainsValue(player)
            select player;

        private readonly Dictionary<User, Player> players = new Dictionary<User, Player>();

        private readonly List<User> users = new List<User>();

        public bool RegisterUserPlayer(User user, out Player player)
        {
            player = null;

            if (!AddUser(user)) return false;

            player = AvailablePlayers.FirstOrDefault();

            players[user] = player;

            return player != null;
        }

        public Player GetUserPlayer(User user)
        {
            if (!users.Contains(user)) return null;

            return players.ContainsKey(user) ? players[user] : null;
        }

        private bool AddUser(User user)
        {
            if (users.Contains(user)) return false;

            users.Add(user);

            LobbyUsersChanged?.Invoke(user);

            return true;
        }

        public IEnumerable<User> Users => players.Select(item => item.Key);

        public IEnumerable<string> Colours => players.Select(item => item.Value.Colour);

        //TODO spectators
    }
}