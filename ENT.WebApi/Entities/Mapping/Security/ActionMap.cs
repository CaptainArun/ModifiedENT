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
    public class ActionMap : IEntityTypeConfiguration<Actions>
    {
        public void Configure(EntityTypeBuilder<Actions> builder)
        {
            builder.ToTable("Action", "Master");
            builder.HasKey(x => x.id);

            builder.Property(x => x.id).HasColumnName("id");
            builder.Property(x => x.ActionName).HasColumnName("ActionName").HasMaxLength(50);
            builder.Property(x => x.ActionDescription).HasColumnName("ActionDescription").HasMaxLength(200);
            builder.Property(x => x.Deleted).HasColumnName("Deleted");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.Modifieddate).HasColumnName("Modifieddate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
