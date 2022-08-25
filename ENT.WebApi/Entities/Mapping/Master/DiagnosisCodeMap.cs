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
    public class DiagnosisCodeMap : IEntityTypeConfiguration<DiagnosisCode>
    {
        public void Configure(EntityTypeBuilder<DiagnosisCode> builder)
        {
            builder.ToTable("DiagnosisCode", "Master");
            builder.HasKey(x => x.DiagnosisCodeID);

            builder.Property(x => x.DiagnosisCodeID).HasColumnName("DiagnosisCodeID");
            builder.Property(x => x.ICDCode).HasColumnName("ICDCode").HasMaxLength(20);
            builder.Property(x => x.CodeStatus).HasColumnName("CodeStatus").HasMaxLength(6);
            builder.Property(x => x.Description).HasColumnName("Description").HasMaxLength(2000);
            builder.Property(x => x.ShortDescription).HasColumnName("ShortDescription").HasMaxLength(500);
            builder.Property(x => x.LongDescription).HasColumnName("LongDescription").HasMaxLength(2000);
            builder.Property(x => x.EffectiveDate).HasColumnName("EffectiveDate");
            builder.Property(x => x.TerminationDate).HasColumnName("TerminationDate");
            builder.Property(x => x.Deleted).HasColumnName("Deleted");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(20);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(20);
            builder.Property(x => x.CodeType).HasColumnName("CodeType").HasMaxLength(10);
            builder.Property(x => x.CodeSystem).HasColumnName("CodeSystem").HasMaxLength(50);
        }
    }
}
