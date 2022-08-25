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
    public class HospitalizationHistoryMap : IEntityTypeConfiguration<HospitalizationHistory>
    {
        public void Configure(EntityTypeBuilder<HospitalizationHistory> builder)
        {
            builder.ToTable("HospitalizationHistory", "dbo");
            builder.HasKey(x => x.HospitalizationID);

            builder.Property(x => x.HospitalizationID).HasColumnName("HospitalizationID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.AdmissionDate).HasColumnName("AdmissionDate");
            builder.Property(x => x.AdmissionType).HasColumnName("AdmissionType").HasMaxLength(50);
            builder.Property(x => x.InitialAdmissionStatus).HasColumnName("InitialAdmissionStatus").HasMaxLength(50);
            builder.Property(x => x.FacilityName).HasColumnName("FacilityName").HasMaxLength(50);
            builder.Property(x => x.AdmittingPhysician).HasColumnName("AdmittingPhysician").HasMaxLength(50);
            builder.Property(x => x.AttendingPhysician).HasColumnName("AttendingPhysician").HasMaxLength(50);
            builder.Property(x => x.ChiefComplaint).HasColumnName("ChiefComplaint").HasMaxLength(500);
            builder.Property(x => x.PrimaryDiagnosis).HasColumnName("PrimaryDiagnosis").HasMaxLength(500);
            builder.Property(x => x.ICDCode).HasColumnName("ICDCode").HasMaxLength(500);
            builder.Property(x => x.ProcedureType).HasColumnName("ProcedureType").HasMaxLength(50);
            builder.Property(x => x.PrimaryProcedure).HasColumnName("PrimaryProcedure").HasMaxLength(500);
            builder.Property(x => x.CPTCode).HasColumnName("CPTCode").HasMaxLength(500);
            builder.Property(x => x.ProblemStatus).HasColumnName("ProblemStatus").HasMaxLength(50);
            builder.Property(x => x.DischargeDate).HasColumnName("DischargeDate");
            builder.Property(x => x.DischargeStatusCode).HasColumnName("DischargeStatusCode").HasMaxLength(500);
            builder.Property(x => x.AdditionalNotes).HasColumnName("AdditionalNotes").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
