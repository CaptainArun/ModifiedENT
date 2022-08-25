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
    public class CallCenterMap : IEntityTypeConfiguration<CallCenter>
    {
        public void Configure(EntityTypeBuilder<CallCenter> builder)
        {
            builder.ToTable("Callcenter", "dbo");
            builder.HasKey(x => x.CallCenterId);

            builder.Property(x => x.CallCenterId).HasColumnName("CallCenterId");
            builder.Property(x => x.PatientId).HasColumnName("PatientId");
            builder.Property(x => x.AppointmentID).HasColumnName("AppointmentID");
            builder.Property(x => x.ProcedureReqID).HasColumnName("ProcedureReqID");
            builder.Property(x => x.NumberCalled).HasColumnName("NumberCalled").HasMaxLength(50);
            builder.Property(x => x.WhomAnswered).HasColumnName("WhomAnswered").HasMaxLength(50);
            builder.Property(x => x.CallStatus).HasColumnName("CallStatus").HasMaxLength(50);
            builder.Property(x => x.AppProcStatus).HasColumnName("AppProcStatus").HasMaxLength(30);
            builder.Property(x => x.MessagePassed).HasColumnName("MessagePassed").HasMaxLength(500);
            builder.Property(x => x.AdditionalInformation).HasColumnName("AdditionalInformation").HasMaxLength(500);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
