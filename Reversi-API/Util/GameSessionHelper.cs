using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Reversi.Game;
using SessionExtensions;

namespace ReversiAPI.Util
{
    public class GameSessionHelper
    {
        private readonly ControllerBase controller;

        public Game CurrentGame
        {
            get => controller.HttpContext.Session.Get<Game>("currentGame");

            set
            {
                if (controller.HttpContext.Session.Get<Game>("currentGame") != null) throw new ArgumentException();

                controller.HttpContext.Session.Set("currentGame", value);
            }
        }

        public void ClearGame()
        {
            controller.HttpContext.Session.Set("currentGame", null);
        }

        public Player SessionPlayer
        {
            get => JsonConvert.DeserializeObject<Player>(controller.HttpContext.Session.GetString("sessionPlayer"));
            set => controller.HttpContext.Session.SetString("sessionPlayer", JsonConvert.SerializeObject(value));
        }

        public bool SessionPlayerIsCurrentPlayer => SessionPlayer == CurrentGame.CurrentPlayer;

        public GameSessionHelper(ControllerBase controller)
        {
            this.controller = controller;
        }
    }
}