using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ENT.WebApi.Entities;

namespace ENT.WebApi.Mapping
{
    public class TenantsMap : IEntityTypeConfiguration<Tenants>
    {
        public void Configure(EntityTypeBuilder<Tenants> builder)
        {
            builder.ToTable("Tenants", "dbo");
            builder.HasKey(x => x.TenantId);

            builder.Property(x => x.TenantId).HasColumnName("TenantId");
            builder.Property(x => x.TenantName).HasColumnName("TenantName").HasMaxLength(50);
            builder.Property(x => x.DisplayName).HasColumnName("DisplayName").HasMaxLength(50);
            builder.Property(x => x.TenantDescription).HasColumnName("TenantDescription").HasMaxLength(200);
            builder.Property(x => x.Address1).HasColumnName("Address1").HasMaxLength(100);
            builder.Property(x => x.Address2).HasColumnName("Address2").HasMaxLength(50);
            builder.Property(x => x.clientid).HasColumnName("clientid");
            builder.Property(x => x.Tenantdbname).HasColumnName("Tenantdbname").HasMaxLength(50);
            builder.Property(x => x.Type).HasColumnName("Type").HasMaxLength(10);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.Modifieddate).HasColumnName("Modifieddate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
