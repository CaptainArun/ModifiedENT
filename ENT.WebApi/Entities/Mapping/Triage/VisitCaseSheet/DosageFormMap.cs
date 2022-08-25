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
    public class DosageFormMap : IEntityTypeConfiguration<DosageForm>
    {
        public void Configure(EntityTypeBuilder<DosageForm> builder)
        {
            builder.ToTable("DosageForm", "Master");
            builder.HasKey(x => x.DosageFormID);

            builder.Property(x => x.DosageFormID).HasColumnName("DosageFormID");
            builder.Property(x => x.DosageFormCode).HasColumnName("DosageFormCode").HasMaxLength(20);
            builder.Property(x => x.DosageFormDescription).HasColumnName("DosageFormDescription").HasMaxLength(100);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
