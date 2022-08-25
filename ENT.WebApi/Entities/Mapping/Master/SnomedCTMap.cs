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
    public class SnomedCTMap : IEntityTypeConfiguration<SnomedCT>
    {
        public void Configure(EntityTypeBuilder<SnomedCT> builder)
        {
            builder.ToTable("SnomedCT", "Master");
            builder.HasKey(x => x.SnomedCTID);

            builder.Property(x => x.SnomedCTID).HasColumnName("SnomedCTID");
            builder.Property(x => x.Code).HasColumnName("Code").HasMaxLength(20);
            builder.Property(x => x.Description).HasColumnName("Description").HasMaxLength(500);
            builder.Property(x => x.VocabularyIDValue).HasColumnName("VocabularyIDValue").HasMaxLength(1);
            builder.Property(x => x.ConceptLevel).HasColumnName("ConceptLevel").HasMaxLength(1);
            builder.Property(x => x.ConceptClassActual).HasColumnName("ConceptClassActual").HasMaxLength(100);
            builder.Property(x => x.ConceptClassAltered).HasColumnName("ConceptClassAltered").HasMaxLength(100);
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
