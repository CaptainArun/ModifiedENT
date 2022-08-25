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
    public class ProcedureRequestMap : IEntityTypeConfiguration<ProcedureRequest>
    {
        public void Configure(EntityTypeBuilder<ProcedureRequest> builder)
        {
            builder.ToTable("ProcedureRequest", "dbo");
            builder.HasKey(x => x.ProcedureRequestId);

            builder.Property(x => x.ProcedureRequestId).HasColumnName("ProcedureRequestId");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.ProcedureRequestedDate).HasColumnName("ProcedureRequestedDate");
            builder.Property(x => x.ProcedureType).HasColumnName("ProcedureType");
            builder.Property(x => x.AdmittingPhysician).HasColumnName("AdmittingPhysician");
            builder.Property(x => x.ApproximateDuration).HasColumnName("ApproximateDuration").HasMaxLength(50);
            builder.Property(x => x.UrgencyID).HasColumnName("UrgencyID");
            builder.Property(x => x.PreProcedureDiagnosis).HasColumnName("PreProcedureDiagnosis").HasMaxLength(2000);
            builder.Property(x => x.ICDCode).HasColumnName("ICDCode").HasMaxLength(500);
            builder.Property(x => x.PlannedProcedure).HasColumnName("PlannedProcedure").HasMaxLength(2000);
            builder.Property(x => x.ProcedureName).HasColumnName("ProcedureName");
            builder.Property(x => x.CPTCode).HasColumnName("CPTCode").HasMaxLength(2000);
            builder.Property(x => x.AnesthesiaFitnessRequired).HasColumnName("AnesthesiaFitnessRequired");
            builder.Property(x => x.AnesthesiaFitnessRequiredDesc).HasColumnName("AnesthesiaFitnessRequiredDesc").HasMaxLength(500);
            builder.Property(x => x.BloodRequired).HasColumnName("BloodRequired");
            builder.Property(x => x.BloodRequiredDesc).HasColumnName("BloodRequiredDesc").HasMaxLength(500);
            builder.Property(x => x.ContinueMedication).HasColumnName("ContinueMedication");
            builder.Property(x => x.StopMedication).HasColumnName("StopMedication");
            builder.Property(x => x.SpecialPreparation).HasColumnName("SpecialPreparation");
            builder.Property(x => x.SpecialPreparationNotes).HasColumnName("SpecialPreparationNotes").HasMaxLength(1000);
            builder.Property(x => x.DietInstructions).HasColumnName("DietInstructions");
            builder.Property(x => x.DietInstructionsNotes).HasColumnName("DietInstructionsNotes").HasMaxLength(1000);
            builder.Property(x => x.OtherInstructions).HasColumnName("OtherInstructions");
            builder.Property(x => x.OtherInstructionsNotes).HasColumnName("OtherInstructionsNotes").HasMaxLength(1000);
            builder.Property(x => x.Cardiology).HasColumnName("Cardiology");
            builder.Property(x => x.Nephrology).HasColumnName("Nephrology");
            builder.Property(x => x.Neurology).HasColumnName("Neurology");
            builder.Property(x => x.OtherConsults).HasColumnName("OtherConsults");
            builder.Property(x => x.OtherConsultsNotes).HasColumnName("OtherConsultsNotes").HasMaxLength(1000);
            builder.Property(x => x.AdmissionType).HasColumnName("AdmissionType");
            builder.Property(x => x.PatientExpectedStay).HasColumnName("PatientExpectedStay").HasMaxLength(100);
            builder.Property(x => x.InstructionToPatient).HasColumnName("InstructionToPatient").HasMaxLength(1000);
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(1000);
            builder.Property(x => x.ProcedureRequestStatus).HasColumnName("ProcedureRequestStatus").HasMaxLength(25);
            builder.Property(x => x.AdmissionStatus).HasColumnName("AdmissionStatus");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
