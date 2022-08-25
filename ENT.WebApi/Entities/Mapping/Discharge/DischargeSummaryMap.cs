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
    public class DischargeSummaryMap : IEntityTypeConfiguration<DischargeSummary>
    {
        public void Configure(EntityTypeBuilder<DischargeSummary> builder)
        {
            builder.ToTable("DischargeSummary", "dbo");
            builder.HasKey(x => x.DischargeSummaryId);

            builder.Property(x => x.DischargeSummaryId).HasColumnName("DischargeSummaryId");
            builder.Property(x => x.RecommendedProcedure).HasColumnName("RecommendedProcedure").HasMaxLength(500);
            builder.Property(x => x.AdmissionNumber).HasColumnName("AdmissionNumber").HasMaxLength(20);
            builder.Property(x => x.AdmissionDate).HasColumnName("AdmissionDate");
            builder.Property(x => x.AdmittingPhysician).HasColumnName("AdmittingPhysician").HasMaxLength(50);
            builder.Property(x => x.PreProcedureDiagnosis).HasColumnName("PreProcedureDiagnosis").HasMaxLength(500);
            builder.Property(x => x.PlannedProcedure).HasColumnName("PlannedProcedure").HasMaxLength(500);
            builder.Property(x => x.Urgency).HasColumnName("Urgency").HasMaxLength(50);
            builder.Property(x => x.AnesthesiaFitnessNotes).HasColumnName("AnesthesiaFitnessNotes").HasMaxLength(500);
            builder.Property(x => x.OtherConsults).HasColumnName("OtherConsults").HasMaxLength(500);
            builder.Property(x => x.PostOperativeDiagnosis).HasColumnName("PostOperativeDiagnosis").HasMaxLength(500);
            builder.Property(x => x.BloodLossInfo).HasColumnName("BloodLossInfo").HasMaxLength(500);
            builder.Property(x => x.Specimens).HasColumnName("Specimens").HasMaxLength(500);
            builder.Property(x => x.PainLevelNotes).HasColumnName("PainLevelNotes").HasMaxLength(500);
            builder.Property(x => x.Complications).HasColumnName("Complications").HasMaxLength(500);
            builder.Property(x => x.ProcedureNotes).HasColumnName("ProcedureNotes").HasMaxLength(500);
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(500);
            builder.Property(x => x.FollowUpDate).HasColumnName("FollowUpDate");
            builder.Property(x => x.FollowUpDetails).HasColumnName("FollowUpDetails").HasMaxLength(500);
            builder.Property(x => x.SignOff).HasColumnName("SignOff");
            builder.Property(x => x.SignOffDate).HasColumnName("SignOffDate");
            builder.Property(x => x.SignOffBy).HasColumnName("SignOffBy").HasMaxLength(50);
            builder.Property(x => x.DischargeStatus).HasColumnName("DischargeStatus").HasMaxLength(20);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
