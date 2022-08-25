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
    public class PostProcedureCaseSheetMap : IEntityTypeConfiguration<PostProcedureCaseSheet>
    {
        public void Configure(EntityTypeBuilder<PostProcedureCaseSheet> builder)
        {
            builder.ToTable("PostProcedureCaseSheet", "dbo");
            builder.HasKey(x => x.PostProcedureID);

            builder.Property(x => x.PostProcedureID).HasColumnName("PostProcedureID");
            builder.Property(x => x.PreProcedureID).HasColumnName("PreProcedureID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedDuring).HasColumnName("RecordedDuring");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(100);
            builder.Property(x => x.ProcedureStartDate).HasColumnName("ProcedureStartDate");
            builder.Property(x => x.ProcedureEndDate).HasColumnName("ProcedureEndDate");
            builder.Property(x => x.AttendingPhysician).HasColumnName("AttendingPhysician");
            builder.Property(x => x.ProcedureNotes).HasColumnName("ProcedureNotes").HasMaxLength(500);
            builder.Property(x => x.ProcedureName).HasColumnName("ProcedureName");
            builder.Property(x => x.PrimaryCPT).HasColumnName("PrimaryCPT").HasMaxLength(1000);
            builder.Property(x => x.Specimens).HasColumnName("Specimens").HasMaxLength(500);
            builder.Property(x => x.DiagnosisNotes).HasColumnName("DiagnosisNotes").HasMaxLength(500);
            builder.Property(x => x.Complications).HasColumnName("Complications").HasMaxLength(500);
            builder.Property(x => x.BloodLossTransfusion).HasColumnName("BloodLossTransfusion").HasMaxLength(500);
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(500);
            builder.Property(x => x.ProcedureStatus).HasColumnName("ProcedureStatus").HasMaxLength(20);
            builder.Property(x => x.ProcedureStatusNotes).HasColumnName("ProcedureStatusNotes").HasMaxLength(500);
            builder.Property(x => x.PatientCondition).HasColumnName("PatientCondition");
            builder.Property(x => x.PainLevel).HasColumnName("PainLevel");
            builder.Property(x => x.PainSleepMedication).HasColumnName("PainSleepMedication").HasMaxLength(500);
            builder.Property(x => x.SignOffDate).HasColumnName("SignOffDate");
            builder.Property(x => x.SignOffUser).HasColumnName("SignOffUser").HasMaxLength(50);
            builder.Property(x => x.SignOffStatus).HasColumnName("SignOffStatus");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
