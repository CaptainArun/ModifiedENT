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
    public class ProviderScheduleMap:IEntityTypeConfiguration<ProviderSchedule>
    {
        public void Configure(EntityTypeBuilder<ProviderSchedule> builder)
        {
            builder.ToTable("ProviderSchedule", "dbo");
            builder.HasKey(x => x.ProviderScheduleID);

            builder.Property(x => x.ProviderScheduleID).HasColumnName("ProviderScheduleID");
            builder.Property(x => x.FacilityID).HasColumnName("FacilityID");
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.TimeSlotDuration).HasColumnName("TimeSlotDuration");
            builder.Property(x => x.BookingPerSlot).HasColumnName("BookingPerSlot");
            builder.Property(x => x.BookingPerDay).HasColumnName("BookingPerDay");
            builder.Property(x => x.AppointmentAllowed).HasColumnName("AppointmentAllowed");
            builder.Property(x => x.AppointmentDay).HasColumnName("AppointmentDay").HasMaxLength(20);
            builder.Property(x => x.RegularWorkHrsFrom).HasColumnName("RegularWorkHrsFrom").HasMaxLength(20);
            builder.Property(x => x.RegularWorkHrsTo).HasColumnName("RegularWorkHrsTo").HasMaxLength(20);
            builder.Property(x => x.BreakHrsFrom1).HasColumnName("BreakHrsFrom1").HasMaxLength(20);
            builder.Property(x => x.BreakHrsTo1).HasColumnName("BreakHrsTo1").HasMaxLength(20);
            builder.Property(x => x.BreakHrsFrom2).HasColumnName("BreakHrsFrom2").HasMaxLength(20);
            builder.Property(x => x.BreakHrsTo2).HasColumnName("BreakHrsTo2").HasMaxLength(20);
            builder.Property(x => x.EffectiveDate).HasColumnName("EffectiveDate");
            builder.Property(x => x.TerminationDate).HasColumnName("TerminationDate");
            builder.Property(x => x.NoOfSlots).HasColumnName("NoOfSlots");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
