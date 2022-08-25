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
    public class RecurrenceAppointmentMap : IEntityTypeConfiguration<RecurrenceAppointment>
    {
        public void Configure(EntityTypeBuilder<RecurrenceAppointment> builder)
        {
            builder.ToTable("RecurrenceAppointment", "dbo");
            builder.HasKey(x => x.RecurrenceId);

            builder.Property(x => x.RecurrenceId).HasColumnName("RecurrenceId");
            builder.Property(x => x.RecurrenceFrom).HasColumnName("RecurrenceFrom");
            builder.Property(x => x.RecurrenceTo).HasColumnName("RecurrenceTo");
            builder.Property(x => x.Deleted).HasColumnName("Deleted");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
