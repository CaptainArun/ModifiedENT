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
    public class VisitTypeMap : IEntityTypeConfiguration<VisitType>
    {
        public void Configure(EntityTypeBuilder<VisitType> builder)
        {
            builder.ToTable("VisitType", "Master");
            builder.HasKey(x => x.VisitTypeId);

            builder.Property(x => x.VisitTypeId).HasColumnName("VisitTypeId");
            builder.Property(x => x.VisitTypeCode).HasColumnName("VisitTypeCode").HasMaxLength(10);
            builder.Property(x => x.VisitTypeDescription).HasColumnName("VisitTypeDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.Modifieddate).HasColumnName("Modifieddate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
