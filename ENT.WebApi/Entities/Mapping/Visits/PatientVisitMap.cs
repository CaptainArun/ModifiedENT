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
    public class PatientVisitMap : IEntityTypeConfiguration<PatientVisit>
    {
        public void Configure(EntityTypeBuilder<PatientVisit> builder)
        {
            builder.ToTable("PatientVisit", "dbo");
            builder.HasKey(x => x.VisitId);

            builder.Property(x => x.VisitId).HasColumnName("VisitId");
            builder.Property(x => x.AppointmentID).HasColumnName("AppointmentID");
            builder.Property(x => x.VisitNo).HasColumnName("VisitNo").HasMaxLength(12);
            builder.Property(x => x.VisitDate).HasColumnName("VisitDate");
            builder.Property(x => x.Visittime).HasColumnName("Visittime").HasMaxLength(50);
            builder.Property(x => x.PatientId).HasColumnName("PatientId");
            builder.Property(x => x.FacilityID).HasColumnName("FacilityID");
            builder.Property(x => x.VisitReason).HasColumnName("VisitReason").HasMaxLength(50);
            builder.Property(x => x.ToConsult).HasColumnName("ToConsult").HasMaxLength(100);
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.ReferringFacility).HasColumnName("ReferringFacility").HasMaxLength(50);
            builder.Property(x => x.ReferringProvider).HasColumnName("ReferringProvider").HasMaxLength(50);
            builder.Property(x => x.ConsultationType).HasColumnName("ConsultationType").HasMaxLength(20);
            builder.Property(x => x.ChiefComplaint).HasColumnName("ChiefComplaint").HasMaxLength(100);
            builder.Property(x => x.AccompaniedBy).HasColumnName("AccompaniedBy").HasMaxLength(500);
            builder.Property(x => x.Appointment).HasColumnName("Appointment").HasMaxLength(20);
            builder.Property(x => x.PatientNextConsultation).HasColumnName("PatientNextConsultation").HasMaxLength(50);
            builder.Property(x => x.TokenNumber).HasColumnName("TokenNumber").HasMaxLength(50);
            builder.Property(x => x.AdditionalInformation).HasColumnName("AdditionalInformation").HasMaxLength(500);
            builder.Property(x => x.TransitionOfCarePatient).HasColumnName("TransitionOfCarePatient");
            builder.Property(x => x.SkipVisitIntake).HasColumnName("SkipVisitIntake");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
            builder.Property(x => x.PatientArrivalConditionID).HasColumnName("PatientArrivalConditionID");
            builder.Property(x => x.UrgencyTypeID).HasColumnName("UrgencyTypeID");
            builder.Property(x => x.VisitStatusID).HasColumnName("VisitStatusID");
            builder.Property(x => x.RecordedDuringID).HasColumnName("RecordedDuringID");
            builder.Property(x => x.VisitTypeID).HasColumnName("VisitTypeID");
        }
    }
}
