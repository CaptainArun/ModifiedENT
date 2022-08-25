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
    public class RolesMap : IEntityTypeConfiguration<Roles>
    {
        public void Configure(EntityTypeBuilder<Roles> builder)
        {
            builder.ToTable("Roles", "Master");
            builder.HasKey(x => x.RoleId);

            builder.Property(x => x.RoleId).HasColumnName("RoleId");
            builder.Property(x => x.RoleName).HasColumnName("RoleName").HasMaxLength(50);
            builder.Property(x => x.RoleDescription).HasColumnName("RoleDescription").HasMaxLength(200);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.Modifieddate).HasColumnName("Modifieddate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
