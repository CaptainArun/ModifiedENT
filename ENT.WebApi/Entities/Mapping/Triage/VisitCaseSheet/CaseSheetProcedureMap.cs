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
    public class CaseSheetProcedureMap : IEntityTypeConfiguration<CaseSheetProcedure>
    {
        public void Configure(EntityTypeBuilder<CaseSheetProcedure> builder)
        {
            builder.ToTable("CaseSheetProcedure", "dbo");
            builder.HasKey(x => x.procedureId);

            builder.Property(x => x.procedureId).HasColumnName("procedureId");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.PrimaryCPT).HasColumnName("PrimaryCPT").HasMaxLength(500);
            builder.Property(x => x.ChiefComplaint).HasColumnName("ChiefComplaint").HasMaxLength(500);
            builder.Property(x => x.DiagnosisNotes).HasColumnName("DiagnosisNotes").HasMaxLength(500);
            builder.Property(x => x.PrimaryICD).HasColumnName("PrimaryICD").HasMaxLength(8000);
            builder.Property(x => x.TreatmentType).HasColumnName("TreatmentType").HasMaxLength(50);
            builder.Property(x => x.RequestedprocedureId).HasColumnName("RequestedprocedureId").HasMaxLength(50);
            builder.Property(x => x.ProcedureNotes).HasColumnName("ProcedureNotes").HasMaxLength(50);
            builder.Property(x => x.Proceduredate).HasColumnName("Proceduredate");
            builder.Property(x => x.ProcedureStatus).HasColumnName("ProcedureStatus").HasMaxLength(50);
            builder.Property(x => x.IsReferred).HasColumnName("IsReferred");
            builder.Property(x => x.ReferralNotes).HasColumnName("ReferralNotes").HasMaxLength(500);
            builder.Property(x => x.FollowUpNotes).HasColumnName("FollowUpNotes").HasMaxLength(1000);
            builder.Property(x => x.AdditionalNotes).HasColumnName("AdditionalNotes").HasMaxLength(1000);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
