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
    public class DischargeCodeMap : IEntityTypeConfiguration<DischargeCode>
    {
        public void Configure(EntityTypeBuilder<DischargeCode> builder)
        {
            builder.ToTable("DischargeCode", "Master");
            builder.HasKey(x => x.DischargeDispositionCodeID);

            builder.Property(x => x.DischargeDispositionCodeID).HasColumnName("DischargeDispositionCodeID");
            builder.Property(x => x.Code).HasColumnName("Code").HasMaxLength(10);
            builder.Property(x => x.Description).HasColumnName("Description").HasMaxLength(300);
            builder.Property(x => x.Deleted).HasColumnName("Deleted");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(20);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(20);
            builder.Property(x => x.CodeType).HasColumnName("CodeType").HasMaxLength(10);
            builder.Property(x => x.SnomedCode).HasColumnName("SnomedCode").HasMaxLength(20);
        }
    }
}
