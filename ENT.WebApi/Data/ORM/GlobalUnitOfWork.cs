using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Data.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Storage;


namespace ENT.WebApi.Data.ORM
{
    public class GlobalUnitOfWork : IGlobalUnitOfWork
    {
        private readonly GlobalContext dbcontext;
        private IDbContextTransaction dbTrans;
        private bool disposed = false;
        private Dictionary<string, object> repository;
        //private readonly IHttpContextAccessor httpContextAccessor;

        public GlobalUnitOfWork(GlobalContext _dbcontext)//, IHttpContextAccessor _httpContextAccessor)
        {
            dbcontext = _dbcontext;
            //httpContextAccessor = _httpContextAccessor;
        }
        public GlobalContext gContext => dbcontext;

        public void BeginTranaction()
        {
            dbTrans = dbcontext.Database.BeginTransaction();
        }

        public void Commit()
        {
            dbTrans.Commit();
        }
        public void Rollback()
        {
            dbTrans.Rollback();
            dbTrans.Dispose();
        }

        public void Save()
        {
            dbcontext.SaveChanges();
        }

        public IGlobalGenericRepository<T> GlobalGenericRepository<T>() where T : class
        {
            if (repository == null)
            {
                repository = new Dictionary<string, object>();
            }

            var entityType = typeof(T).Name;

            if (!repository.ContainsKey(entityType))
            {
                var repositoryType = typeof(GlobalGenericRepository<>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(T)), new object[] { this });
                repository.Add(entityType, repositoryInstance);
            }

            return (IGlobalGenericRepository<T>)repository[entityType];

        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    dbcontext.Dispose();
                }
            }
            disposed = true;
        }
    }
}
