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
    public class ScreenMap : IEntityTypeConfiguration<Screen>
    {
        public void Configure(EntityTypeBuilder<Screen> builder)
        {
            builder.ToTable("Screen", "Master");
            builder.HasKey(x => x.ScreenId);

            builder.Property(x => x.ScreenId).HasColumnName("ScreenId");
            builder.Property(x => x.ModuleId).HasColumnName("ModuleId");
            builder.Property(x => x.ScreenName).HasColumnName("ScreenName").HasMaxLength(50);
            builder.Property(x => x.ScreenDescription).HasColumnName("ScreenDescription").HasMaxLength(200);
            builder.Property(x => x.ActionURL).HasColumnName("ActionURL").HasMaxLength(2500);
            builder.Property(x => x.Deleted).HasColumnName("Deleted");
            builder.Property(x => x.DisplayOrder).HasColumnName("DisplayOrder");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.Modifieddate).HasColumnName("Modifieddate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
