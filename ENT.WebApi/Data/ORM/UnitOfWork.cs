using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Data.Context;
using ENT.WebApi.Entities.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Storage;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace ENT.WebApi.Data.ORM
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext dbcontext;
        private IDbContextTransaction dbTrans;
        private bool disposed = false;
        private Dictionary<string, object> repository;
        private readonly IHttpContextAccessor httpContextAccessor;

        public UnitOfWork(AppDbContext _dbcontext, IHttpContextAccessor _httpContextAccessor)
        {
            dbcontext = _dbcontext;
            httpContextAccessor = _httpContextAccessor;
        }
        public AppDbContext context => dbcontext;

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
            //dbcontext.SaveChanges();

            List<DBAudit> auditEntries = OnBeforeChanges();
            dbcontext.SaveChanges();
            OnAfterChanges(auditEntries);
        }

        public IGenericRepository<T> GenericRepository<T>() where T : class
        {
            if (repository == null)
            {
                repository = new Dictionary<string, object>();
            }

            var entityType = typeof(T).Name;

            if (!repository.ContainsKey(entityType))
            {
                var repositoryType = typeof(GenericRepository<>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(T)), new object[] { this });
                repository.Add(entityType, repositoryInstance);
            }

            return (IGenericRepository<T>)repository[entityType];

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

        private List<DBAudit> OnBeforeChanges()
        {
            List<DBAudit> auditEntries = new List<DBAudit>();
            DBAudit audit;
            Dictionary<string, object> OldValues = new Dictionary<string, object>();
            Dictionary<string, object> NewValues = new Dictionary<string, object>();
            Dictionary<string, object> ChangedValues = new Dictionary<string, object>();
            string propertyName, action;


            dbcontext.ChangeTracker.DetectChanges();
            foreach (EntityEntry entry in dbcontext.ChangeTracker.Entries())
            {
                if (entry.Entity is DBAudit || entry.State == Microsoft.EntityFrameworkCore.EntityState.Detached || entry.State == Microsoft.EntityFrameworkCore.EntityState.Unchanged)
                {
                    continue;
                }
                OldValues.Clear();
                NewValues.Clear();
                ChangedValues.Clear();


                action = entry.State == Microsoft.EntityFrameworkCore.EntityState.Added ? "I" : (entry.State == Microsoft.EntityFrameworkCore.EntityState.Modified ? "U" : "D");

                foreach (PropertyEntry property in entry.Properties)
                {
                    propertyName = property.Metadata.Name;

                    switch (entry.State)
                    {
                        case Microsoft.EntityFrameworkCore.EntityState.Added:
                            NewValues.Add(propertyName, property.CurrentValue);
                            break;
                        case Microsoft.EntityFrameworkCore.EntityState.Deleted:
                            OldValues.Add(propertyName, property.OriginalValue);
                            break;
                        case Microsoft.EntityFrameworkCore.EntityState.Modified:
                            if (property.IsModified)
                            {
                                ChangedValues.Add(propertyName, property.CurrentValue);
                                NewValues.Add(propertyName, property.CurrentValue);
                                OldValues.Add(propertyName, property.OriginalValue);
                            }
                            break;

                    }

                }
                audit = new DBAudit();
                audit.TableName = entry.Metadata.Name;
                audit.UserName = httpContextAccessor.HttpContext.User.Identity.Name;
                audit.AuditDate = DateTime.Now;
                audit.Action = action;
                audit.OldData = OldValues.Count() == 0 ? null : JsonConvert.SerializeObject(OldValues);
                audit.NewData = NewValues.Count() == 0 ? null : JsonConvert.SerializeObject(NewValues);
                audit.ChangedColumns = ChangedValues.Count() == 0 ? null : JsonConvert.SerializeObject(ChangedValues);

                auditEntries.Add(audit);
            }

            return auditEntries;
        }

        private void OnAfterChanges(List<DBAudit> auditEntries)
        {
            if (auditEntries == null || auditEntries.Count() == 0)
            {
                return;
            }

            foreach (DBAudit audit in auditEntries)
            {
                this.GenericRepository<DBAudit>().Insert(audit);
            }
            dbcontext.SaveChanges();
        }

    }
}
