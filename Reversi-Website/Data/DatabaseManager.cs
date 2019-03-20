using System.Data.SqlClient;
using Microsoft.Data.Sqlite;

namespace Reversi_Website.Data
{
    /// <summary>
    /// Borrowed from StackOverflow: <see cref="https://stackoverflow.com/questions/15174601/in-c-sharp-global-connection-to-be-used-in-all-classes"/>
    /// </summary>
    public class DatabaseManager
    {
        private static DatabaseManager instance;

        private const string CONNECTION_STRING = "Data Source=reversi.sqlite;";

        private string ConnectionString => CONNECTION_STRING;

        public static DatabaseManager Instance => instance;

        private DatabaseManager()
        {
        }

        static DatabaseManager()
        {
            instance = new DatabaseManager();
        }


        public SqliteConnection CreateConnection()
        {
            return new SqliteConnection(ConnectionString);
        }
    }
}