using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.Mapping;

namespace ENT.WebApi.Data.Context
{
    public class GlobalContext : IdentityDbContext<AspNetUsers>
    {
        public GlobalContext(DbContextOptions<GlobalContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new AspNetUsersMap());
            modelBuilder.ApplyConfiguration(new UserTenantSetupMap());
            modelBuilder.ApplyConfiguration(new TenantsMap());
            modelBuilder.ApplyConfiguration(new ClientMap());
            modelBuilder.ApplyConfiguration(new ClientSubscriptionMap()); 
            modelBuilder.ApplyConfiguration(new DiagnosisCodeMap());
            modelBuilder.ApplyConfiguration(new DischargeCodeMap());
            modelBuilder.ApplyConfiguration(new DrugCodeMap());
            modelBuilder.ApplyConfiguration(new SpecialityMap());
            modelBuilder.ApplyConfiguration(new TreatmentCodeMap());
            modelBuilder.ApplyConfiguration(new SnomedCTMap());
        }
    }
}
