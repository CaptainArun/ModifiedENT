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
    public class ProblemAreaMap : IEntityTypeConfiguration<ProblemArea>
    {
        public void Configure(EntityTypeBuilder<ProblemArea> builder)
        {
            builder.ToTable("ProblemArea", "Master");
            builder.HasKey(x => x.ProblemAreaId);

            builder.Property(x => x.ProblemAreaId).HasColumnName("ProblemAreaId");
            builder.Property(x => x.ProblemAreaCode).HasColumnName("ProblemAreaCode");
            builder.Property(x => x.ProblemAreaDescription).HasColumnName("ProblemAreaDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
