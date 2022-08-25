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
    public class UserTenantSetupMap : IEntityTypeConfiguration<UserTenantSetup>
    {
        public void Configure(EntityTypeBuilder<UserTenantSetup> builder)
        {
            builder.ToTable("UserTenantSetup", "dbo");
            builder.HasKey(x => x.UserTenantId);

            builder.Property(x => x.UserTenantId).HasColumnName("UserTenantId");
            builder.Property(x => x.UserId).HasColumnName("UserId").HasMaxLength(450);
            builder.Property(x => x.TenantId).HasColumnName("TenantId");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
            builder.Property(x => x.Modifieddate).HasColumnName("Modifieddate");
        }
    }
}
