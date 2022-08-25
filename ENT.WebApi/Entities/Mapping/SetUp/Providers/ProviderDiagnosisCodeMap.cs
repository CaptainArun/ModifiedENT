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
    public class ProviderDiagnosisCodeMap : IEntityTypeConfiguration<ProviderDiagnosisCode>
    {
        public void Configure(EntityTypeBuilder<ProviderDiagnosisCode> builder)
        {
            builder.ToTable("ProviderDiagnosisCode", "dbo");
            builder.HasKey(x => x.ProviderDiagnosisCodeID);

            builder.Property(x => x.ProviderDiagnosisCodeID).HasColumnName("ProviderDiagnosisCodeID");
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.DiagnosisCodeID).HasColumnName("DiagnosisCodeID");
            builder.Property(x => x.ICDCode).HasColumnName("ICDCode").HasMaxLength(500);
            builder.Property(x => x.Deleted).HasColumnName("Deleted");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
