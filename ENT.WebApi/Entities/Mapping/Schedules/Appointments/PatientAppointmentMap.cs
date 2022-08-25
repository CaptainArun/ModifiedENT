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
    public class PatientAppointmentMap : IEntityTypeConfiguration<PatientAppointment>
    {
        public void Configure(EntityTypeBuilder<PatientAppointment> builder)
        {
            builder.ToTable("PatientAppointment", "dbo");
            builder.HasKey(x => x.AppointmentID);

            builder.Property(x => x.AppointmentID).HasColumnName("AppointmentID");
            builder.Property(x => x.AppointmentDate).HasColumnName("AppointmentDate");
            builder.Property(x => x.AppointmentNo).HasColumnName("AppointmentNo").HasMaxLength(12);
            builder.Property(x => x.PatientID).HasColumnName("PatientID");
            builder.Property(x => x.Duration).HasColumnName("Duration").HasMaxLength(50);
            builder.Property(x => x.Reason).HasColumnName("Reason").HasMaxLength(50);
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.FacilityID).HasColumnName("FacilityID");
            builder.Property(x => x.ToConsult).HasColumnName("ToConsult").HasMaxLength(100);
            builder.Property(x => x.AppointmentStatusID).HasColumnName("AppointmentStatusID");
            builder.Property(x => x.AppointmentTypeID).HasColumnName("AppointmentTypeID");
            builder.Property(x => x.CPTCode).HasColumnName("CPTCode");
            builder.Property(x => x.AddToWaitList).HasColumnName("AddToWaitList");
            builder.Property(x => x.IsRecurrence).HasColumnName("IsRecurrence");
            builder.Property(x => x.RecurrenceId).HasColumnName("RecurrenceId");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
