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
    public class DiagnosisMap : IEntityTypeConfiguration<Diagnosis>
    {
        public void Configure(EntityTypeBuilder<Diagnosis> builder)
        {
            builder.ToTable("Diagnosis", "dbo");
            builder.HasKey(x => x.DiagnosisId);

            builder.Property(x => x.DiagnosisId).HasColumnName("DiagnosisId");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.ChiefComplaint).HasColumnName("ChiefComplaint").HasMaxLength(500);
            builder.Property(x => x.ProblemAreaID).HasColumnName("ProblemAreaID").HasMaxLength(30);
            builder.Property(x => x.ProblemDuration).HasColumnName("ProblemDuration").HasMaxLength(50);
            builder.Property(x => x.PreviousHistory).HasColumnName("PreviousHistory").HasMaxLength(50);
            builder.Property(x => x.SymptomsID).HasColumnName("SymptomsID").HasMaxLength(30);
            builder.Property(x => x.OtherSymptoms).HasColumnName("OtherSymptoms").HasMaxLength(500);
            builder.Property(x => x.PainScale).HasColumnName("PainScale");
            builder.Property(x => x.PainNotes).HasColumnName("PainNotes").HasMaxLength(500);
            builder.Property(x => x.Timings).HasColumnName("Timings").HasMaxLength(150);
            builder.Property(x => x.ProblemTypeID).HasColumnName("ProblemTypeID").HasMaxLength(30);
            builder.Property(x => x.AggravatedBy).HasColumnName("AggravatedBy").HasMaxLength(50);
            builder.Property(x => x.Alleviatedby).HasColumnName("Alleviatedby").HasMaxLength(50);
            builder.Property(x => x.ProblemStatus).HasColumnName("ProblemStatus").HasMaxLength(50);
            builder.Property(x => x.Observationotes).HasColumnName("Observationotes").HasMaxLength(500);
            builder.Property(x => x.InteractionSummary).HasColumnName("InteractionSummary").HasMaxLength(500);
            builder.Property(x => x.PAdditionalNotes).HasColumnName("PAdditionalNotes").HasMaxLength(1000);
            builder.Property(x => x.Prognosis).HasColumnName("Prognosis").HasMaxLength(500);
            builder.Property(x => x.AssessmentNotes).HasColumnName("AssessmentNotes").HasMaxLength(1000);
            builder.Property(x => x.ICD10).HasColumnName("ICDCode").HasMaxLength(8000);
            builder.Property(x => x.DiagnosisNotes).HasColumnName("DiagnosisNotes").HasMaxLength(500);
            builder.Property(x => x.Etiology).HasColumnName("Etiology").HasMaxLength(500);
            builder.Property(x => x.DAdditionalNotes).HasColumnName("DAdditionalNotes").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
