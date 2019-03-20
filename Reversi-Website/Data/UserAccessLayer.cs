using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Microsoft.Data.Sqlite;
using Reversi_Website.Data.interfaces;
using Reversi_Website.Models;
using Reversi_Website.Util.Query;

namespace Reversi_Website.Data
{
    public class UserAccessLayer : IAccessLayer<User>
    {
        private const string CONN_STRING = @"Data Source=(reversi.sqlite)";

        public bool TryFetch(int id, out User output)
        {
            throw new System.NotImplementedException();
        }

        /// <summary>
        /// Fetches user from database. Returns <code>null</code> if not found 
        /// </summary>
        /// <param name="id">User's id</param>
        /// <returns><code>User</code> or <code>null</code></returns>
        public User Fetch(int id)
        {
            return TryFetch(id, out User user) ? user : null;
        }

        public User FetchByEmail(string email)
        {
            //TODO fetch id then Fetch(id)
            throw new NotImplementedException();
        }

        public IEnumerable<User> FetchList()
        {
            throw new System.NotImplementedException();
        }

        public bool Add(User user, out IEnumerable<string> errors)
        {
            errors = new List<string>();

            int result;

            using (SqliteConnection sqlConnection = DatabaseManager.Instance.CreateConnection())
            {
                sqlConnection.Open();

                Dictionary<string, object> queryFields = new Dictionary<string, object>
                {
                    {"email_address", user.EmailAddress},
                    {"password_hash", user.PasswordHash?.ToString()}
                };

                QueryFactory queryFactory = new QueryFactory("user", sqlConnection);

                SqliteCommand sqlCommand = queryFactory.CreateInsertQuery(queryFields);

                result = sqlCommand.ExecuteNonQuery();

                sqlConnection.Close();
            }

            return result == 1;
        }

        public bool Update(User item, out IEnumerable<string> errors)
        {
            throw new System.NotImplementedException();
        }

        public bool Delete(User item, out IEnumerable<string> errors)
        {
            throw new System.NotImplementedException();
        }
    }
}