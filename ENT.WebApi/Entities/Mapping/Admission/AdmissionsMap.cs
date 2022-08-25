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
    public class AdmissionsMap : IEntityTypeConfiguration<Admissions>
    {
        public void Configure(EntityTypeBuilder<Admissions> builder)
        {
            builder.ToTable("Admissions", "dbo");
            builder.HasKey(x => x.AdmissionID);

            builder.Property(x => x.AdmissionID).HasColumnName("AdmissionID");
            builder.Property(x => x.FacilityID).HasColumnName("FacilityID");
            builder.Property(x => x.PatientID).HasColumnName("PatientID");
            builder.Property(x => x.ProcedureRequestId).HasColumnName("ProcedureRequestId");
            builder.Property(x => x.AdmissionDateTime).HasColumnName("AdmissionDateTime");
            builder.Property(x => x.AdmissionNo).HasColumnName("AdmissionNo").HasMaxLength(50);
            builder.Property(x => x.AdmissionOrigin).HasColumnName("AdmissionOrigin").HasMaxLength(20);
            builder.Property(x => x.AdmissionType).HasColumnName("AdmissionType");
            builder.Property(x => x.AdmittingPhysician).HasColumnName("AdmittingPhysician");
            builder.Property(x => x.SpecialityID).HasColumnName("SpecialityID");
            builder.Property(x => x.AdmittingReason).HasColumnName("AdmittingReason").HasMaxLength(2000);
            builder.Property(x => x.PreProcedureDiagnosis).HasColumnName("PreProcedureDiagnosis").HasMaxLength(2000);
            builder.Property(x => x.ICDCode).HasColumnName("ICDCode").HasMaxLength(500);
            builder.Property(x => x.ProcedureType).HasColumnName("ProcedureType");
            builder.Property(x => x.PlannedProcedure).HasColumnName("PlannedProcedure").HasMaxLength(2000);
            builder.Property(x => x.ProcedureName).HasColumnName("ProcedureName");
            builder.Property(x => x.CPTCode).HasColumnName("CPTCode").HasMaxLength(500);
            builder.Property(x => x.UrgencyID).HasColumnName("UrgencyID");
            builder.Property(x => x.PatientArrivalCondition).HasColumnName("PatientArrivalCondition");
            builder.Property(x => x.PatientArrivalBy).HasColumnName("PatientArrivalBy");
            builder.Property(x => x.PatientExpectedStay).HasColumnName("PatientExpectedStay").HasMaxLength(100);
            builder.Property(x => x.AnesthesiaFitnessRequired).HasColumnName("AnesthesiaFitnessRequired");
            builder.Property(x => x.AnesthesiaFitnessRequiredDesc).HasColumnName("AnesthesiaFitnessRequiredDesc").HasMaxLength(500);
            builder.Property(x => x.BloodRequired).HasColumnName("BloodRequired");
            builder.Property(x => x.BloodRequiredDesc).HasColumnName("BloodRequiredDesc").HasMaxLength(500);
            builder.Property(x => x.ContinueMedication).HasColumnName("ContinueMedication");
            builder.Property(x => x.InitialAdmissionStatus).HasColumnName("InitialAdmissionStatus");
            builder.Property(x => x.InstructionToPatient).HasColumnName("InstructionToPatient").HasMaxLength(1000);
            builder.Property(x => x.AccompaniedBy).HasColumnName("AccompaniedBy").HasMaxLength(1000);
            builder.Property(x => x.WardAndBed).HasColumnName("WardAndBed").HasMaxLength(1000);
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(1000);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
