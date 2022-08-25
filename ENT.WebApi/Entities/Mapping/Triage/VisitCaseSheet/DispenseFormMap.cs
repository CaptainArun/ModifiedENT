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
    public class DispenseFormMap : IEntityTypeConfiguration<DispenseForm>
    {
        public void Configure(EntityTypeBuilder<DispenseForm> builder)
        {
            builder.ToTable("DispenseForm", "Master");
            builder.HasKey(x => x.DispenseFormID);

            builder.Property(x => x.DispenseFormID).HasColumnName("DispenseFormID");
            builder.Property(x => x.DispenseFormCode).HasColumnName("DispenseFormCode").HasMaxLength(20);
            builder.Property(x => x.DispenseFormDescription).HasColumnName("DispenseFormDescription").HasMaxLength(100);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
