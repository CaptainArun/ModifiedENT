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
    public class ModulesMap : IEntityTypeConfiguration<Modules>
    {
        public void Configure(EntityTypeBuilder<Modules> builder)
        {
            builder.ToTable("Modules", "Master");
            builder.HasKey(x => x.ModuleId);

            builder.Property(x => x.ModuleId).HasColumnName("ModuleId");
            builder.Property(x => x.ModuleName).HasColumnName("ModuleName").HasMaxLength(50);
            builder.Property(x => x.ModuleDescription).HasColumnName("ModuleDescription").HasMaxLength(200);
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.Modifieddate).HasColumnName("Modifieddate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
