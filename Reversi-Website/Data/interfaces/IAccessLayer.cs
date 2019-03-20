using System.Collections;
using System.Collections.Generic;

namespace Reversi_Website.Data.interfaces
{
    public interface IAccessLayer<T>
    {
        bool TryFetch(int id, out T output);
        T Fetch(int id);

        IEnumerable<T> FetchList();

        bool Add(T user, out IEnumerable<string> errors);

        bool Update(T item, out IEnumerable<string> errors);

        bool Delete(T item, out IEnumerable<string> errors);
    }
}