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
    public class RoleScreenPermissionMappingMap : IEntityTypeConfiguration<RoleScreenPermissionMapping>
    {
        public void Configure(EntityTypeBuilder<RoleScreenPermissionMapping> builder)
        {
            builder.ToTable("RoleScreenPermissionMapping", "Master");
            builder.HasKey(x => x.RoleScreenId);

            builder.Property(x => x.RoleScreenId).HasColumnName("RoleScreenId");
            builder.Property(x => x.RoleId).HasColumnName("RoleId");
            builder.Property(x => x.ScreenId).HasColumnName("ScreenId");
            builder.Property(x => x.actionid).HasColumnName("actionid");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.Modifieddate).HasColumnName("Modifieddate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
