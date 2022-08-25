using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace ENT.WebApi.Data.ORM
{
    public class GlobalGenericRepository<T> : IGlobalGenericRepository<T> where T : class
    {
        private DbSet<T> dbSet;
        private readonly IGlobalUnitOfWork uow;
        //private readonly IHttpContextAccessor httpContextAccessor;
        public GlobalGenericRepository(IGlobalUnitOfWork _uow)//, IHttpContextAccessor _httpContextAccessor)
        {
            uow = _uow;
            //httpContextAccessor=_httpContextAccessor;
            dbSet = uow.gContext.Set<T>();
        }

        public IEnumerable<T> GetAll()
        {
            return dbSet.ToList();
        }

        public T GetItemById(object i)
        {
            return dbSet.Find(i);
        }

        public T Insert(T item)
        {
            return dbSet.Add(item).Entity;
        }

        public T Update(T item)
        {
            uow.gContext.Entry(item).State = EntityState.Modified;
            return dbSet.Update(item).Entity;
        }
        public void Delete(T item)//object i)
        {
            //T item = dbSet.Find(i);
            dbSet.Remove(item);
        }

        public IQueryable<T> Table()
        {
            return dbSet;
        }
    }
}
