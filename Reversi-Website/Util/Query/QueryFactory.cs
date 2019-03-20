using System.Collections.Generic;
using System.Linq;
using Microsoft.Data.Sqlite;

namespace Reversi_Website.Util.Query
{
    public class QueryFactory
    {
        private string TableName { get; }
        private SqliteConnection Connection { get; }

        public QueryFactory(string tableName, SqliteConnection connection)
        {
            TableName = tableName;
            Connection = connection;
        }

        public SqliteCommand CreateInsertQuery(Dictionary<string, object> queryFields)
        {
            Dictionary<string, object> notNullFields = queryFields.Where(item => item.Value != null).ToDictionary(item => item.Key, item => item.Value);

            string fieldString = string.Join(", ", notNullFields.Select(item => item.Key));
            string valueString = string.Join(", ", notNullFields.Select(item => $"@{item.Key}"));

            string query = $"INSERT INTO user({fieldString}) VALUES ({valueString})";

            SqliteCommand sqlCommand = new SqliteCommand(query, this.Connection);

            foreach ((string key, object value) in notNullFields)
            {
                sqlCommand.Parameters.AddWithValue(key, value);
            }

            return sqlCommand;
        }
    }
}