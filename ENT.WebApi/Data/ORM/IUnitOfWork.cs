using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Data.Context;

namespace ENT.WebApi.Data.ORM
{
    public interface IUnitOfWork : IDisposable
    {
        AppDbContext context { get; }

        void BeginTranaction();

        void Commit();

        void Rollback();

        void Save();

        IGenericRepository<T> GenericRepository<T>() where T : class;
    }
}
