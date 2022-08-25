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
    public class RecordedDuringMap : IEntityTypeConfiguration<RecordedDuring>
    {
        public void Configure(EntityTypeBuilder<RecordedDuring> builder)
        {
            builder.ToTable("RecordedDuring", "Master");
            builder.HasKey(x => x.RecordedDuringId);

            builder.Property(x => x.RecordedDuringId).HasColumnName("RecordedDuringId");
            builder.Property(x => x.RecordedDuringCode).HasColumnName("RecordedDuringCode").HasMaxLength(10);
            builder.Property(x => x.RecordedDuringDescription).HasColumnName("RecordedDuringDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
