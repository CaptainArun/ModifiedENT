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
    public class ProviderTreatmentCodeMap : IEntityTypeConfiguration<ProviderTreatmentCode>
    {
        public void Configure(EntityTypeBuilder<ProviderTreatmentCode> builder)
        {
            builder.ToTable("ProviderTreatmentCode", "dbo");
            builder.HasKey(x => x.ProviderTreatmentCodeID);

            builder.Property(x => x.ProviderTreatmentCodeID).HasColumnName("ProviderTreatmentCodeID");
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.TreatmentCodeID).HasColumnName("TreatmentCodeID");
            builder.Property(x => x.CPTCode).HasColumnName("CPTCode").HasMaxLength(500);
            builder.Property(x => x.Deleted).HasColumnName("Deleted");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
