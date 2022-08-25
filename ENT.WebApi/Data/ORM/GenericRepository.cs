using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.Data.ORM
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private DbSet<T> dbSet;
        private readonly IUnitOfWork uow;
        //private readonly IHttpContextAccessor httpContextAccessor;
        public GenericRepository(IUnitOfWork _uow)//, IHttpContextAccessor _httpContextAccessor)
        {
            uow = _uow;
            //httpContextAccessor=_httpContextAccessor;
            dbSet = uow.context.Set<T>();
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
            uow.context.Entry(item).State = EntityState.Modified;
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
