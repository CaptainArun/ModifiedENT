using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.Data.ORM
{
    public interface IGenericRepository<T> where T : class
    {
        IEnumerable<T> GetAll();

        T GetItemById(object i);

        T Insert(T item);

        T Update(T item);

        void Delete(T item);// (object i);

        IQueryable<T> Table();
    }
}
