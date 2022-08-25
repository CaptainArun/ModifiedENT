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
    public class TreatmentCodeMap : IEntityTypeConfiguration<TreatmentCode>
    {
        public void Configure(EntityTypeBuilder<TreatmentCode> builder)
        {
            builder.ToTable("TreatmentCode", "Master");
            builder.HasKey(x => x.TreatmentCodeID);

            builder.Property(x => x.TreatmentCodeID).HasColumnName("TreatmentCodeID");
            builder.Property(x => x.CPTCode).HasColumnName("CPTCode").HasMaxLength(20);
            builder.Property(x => x.Description).HasColumnName("Description").HasMaxLength(4000);
            builder.Property(x => x.ShortDescription).HasColumnName("ShortDescription").HasMaxLength(200);
            builder.Property(x => x.LongDescription).HasColumnName("LongDescription").HasMaxLength(4000);
            builder.Property(x => x.ServiceIDQualifier).HasColumnName("ServiceIDQualifier").HasMaxLength(2);
            builder.Property(x => x.EffectiveDate).HasColumnName("EffectiveDate");
            builder.Property(x => x.TerminationDate).HasColumnName("TerminationDate");
            builder.Property(x => x.Deleted).HasColumnName("Deleted");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(20);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(20);
            builder.Property(x => x.CodeSystem).HasColumnName("CodeSystem").HasMaxLength(50);
        }
    }
}
