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
    public class UrgencyTypeMap : IEntityTypeConfiguration<UrgencyType>
    {
        public void Configure(EntityTypeBuilder<UrgencyType> builder)
        {
            builder.ToTable("UrgencyType", "Master");
            builder.HasKey(x => x.UrgencyTypeId);

            builder.Property(x => x.UrgencyTypeId).HasColumnName("UrgencyTypeId");
            builder.Property(x => x.UrgencyTypeCode).HasColumnName("UrgencyTypeCode").HasMaxLength(10);
            builder.Property(x => x.UrgencyTypeDescription).HasColumnName("UrgencyTypeDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
