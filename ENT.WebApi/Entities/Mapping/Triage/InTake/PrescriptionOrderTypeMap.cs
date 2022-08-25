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
    public class PrescriptionOrderTypeMap : IEntityTypeConfiguration<PrescriptionOrderType>
    {
        public void Configure(EntityTypeBuilder<PrescriptionOrderType> builder)
        {
            builder.ToTable("PrescriptionOrderType", "dbo");
            builder.HasKey(x => x.PrescriptionOrderTypeId);

            builder.Property(x => x.PrescriptionOrderTypeId).HasColumnName("PrescriptionOrderTypeId");
            builder.Property(x => x.PrescriptionOrderTypeCode).HasColumnName("PrescriptionOrderTypeCode");
            builder.Property(x => x.PrescriptionOrderTypeDescription).HasColumnName("PrescriptionOrderTypeDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
