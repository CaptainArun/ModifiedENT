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
    public class IdentificationIdTypeMap : IEntityTypeConfiguration<IdentificationIdType>
    {
        public void Configure(EntityTypeBuilder<IdentificationIdType> builder)
        {
            builder.ToTable("IdentificationIdType", "Master");
            builder.HasKey(x => x.IDTId);

            builder.Property(x => x.IDTId).HasColumnName("IDTId");
            builder.Property(x => x.IDTCode).HasColumnName("IDTCode").HasMaxLength(10);
            builder.Property(x => x.IDTDescription).HasColumnName("IDTDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
