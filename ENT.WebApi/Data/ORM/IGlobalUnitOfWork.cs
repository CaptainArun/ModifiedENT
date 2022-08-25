using ENT.WebApi.Data.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.Data.ORM
{
    public interface IGlobalUnitOfWork : IDisposable
    {
        GlobalContext gContext { get; }

        void BeginTranaction();

        void Commit();

        void Rollback();

        void Save();

        IGlobalGenericRepository<T> GlobalGenericRepository<T>() where T : class;
    }
}
