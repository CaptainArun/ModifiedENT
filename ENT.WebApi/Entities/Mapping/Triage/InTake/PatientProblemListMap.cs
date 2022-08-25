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
    public class PatientProblemListMap : IEntityTypeConfiguration<PatientProblemList>
    {
        public void Configure(EntityTypeBuilder<PatientProblemList> builder)
        {
            builder.ToTable("PatientProblemList", "dbo");
            builder.HasKey(x => x.ProblemlistId);

            builder.Property(x => x.ProblemlistId).HasColumnName("ProblemlistId");
            builder.Property(x => x.PatientId).HasColumnName("PatientId");
            builder.Property(x => x.VisitId).HasColumnName("VisitId");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.ProblemTypeID).HasColumnName("ProblemTypeID");
            builder.Property(x => x.ProblemDescription).HasColumnName("ProblemDescription").HasMaxLength(500);
            builder.Property(x => x.ICD10Code).HasColumnName("ICD10Code").HasMaxLength(500);
            builder.Property(x => x.SNOMEDCode).HasColumnName("SNOMEDCode").HasMaxLength(500);
            builder.Property(x => x.Aggravatedby).HasColumnName("Aggravatedby").HasMaxLength(75);
            builder.Property(x => x.DiagnosedDate).HasColumnName("DiagnosedDate");
            builder.Property(x => x.ResolvedDate).HasColumnName("ResolvedDate");
            builder.Property(x => x.Status).HasColumnName("Status").HasMaxLength(20);
            builder.Property(x => x.AttendingPhysican).HasColumnName("AttendingPhysican").HasMaxLength(50);
            builder.Property(x => x.AlleviatedBy).HasColumnName("AlleviatedBy").HasMaxLength(75);
            builder.Property(x => x.FileName).HasColumnName("FileName").HasMaxLength(50);
            builder.Property(x => x.Notes).HasColumnName("Notes").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
        }
    }
}
