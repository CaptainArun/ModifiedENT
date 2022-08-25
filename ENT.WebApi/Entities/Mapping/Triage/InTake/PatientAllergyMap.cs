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
    public class PatientAllergyMap : IEntityTypeConfiguration<PatientAllergy>
    {
        public void Configure(EntityTypeBuilder<PatientAllergy> builder)
        {
            builder.ToTable("PatientAllergy", "dbo");
            builder.HasKey(x => x.AllergyId);

            builder.Property(x => x.AllergyId).HasColumnName("AllergyId");
            builder.Property(x => x.PatientId).HasColumnName("PatientId");
            builder.Property(x => x.VisitId).HasColumnName("VisitId");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.AllergyTypeID).HasColumnName("AllergyTypeID");
            builder.Property(x => x.Name).HasColumnName("Name").HasMaxLength(75);
            builder.Property(x => x.Allergydescription).HasColumnName("Allergydescription").HasMaxLength(500);
            builder.Property(x => x.Aggravatedby).HasColumnName("Aggravatedby").HasMaxLength(75);
            builder.Property(x => x.Alleviatedby).HasColumnName("Alleviatedby").HasMaxLength(75);
            builder.Property(x => x.Onsetdate).HasColumnName("Onsetdate");
            builder.Property(x => x.AllergySeverityID).HasColumnName("AllergySeverityID");
            builder.Property(x => x.Reaction).HasColumnName("Reaction").HasMaxLength(75);
            builder.Property(x => x.Status).HasColumnName("Status").HasMaxLength(50);
            builder.Property(x => x.ICD10).HasColumnName("ICD10").HasMaxLength(500);
            builder.Property(x => x.SNOMED).HasColumnName("SNOMED").HasMaxLength(500);
            builder.Property(x => x.Notes).HasColumnName("Notes").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
        }
    }
}
