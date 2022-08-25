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
    public class PatientMedicationHistoryMap : IEntityTypeConfiguration<PatientMedicationHistory>
    {
        public void Configure(EntityTypeBuilder<PatientMedicationHistory> builder)
        {
            builder.ToTable("PatientMedicationHistory", "dbo");
            builder.HasKey(x => x.PatientmedicationId);

            builder.Property(x => x.PatientmedicationId).HasColumnName("PatientmedicationId");
            builder.Property(x => x.PatientId).HasColumnName("PatientId");
            builder.Property(x => x.VisitId).HasColumnName("VisitId");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.DrugName).HasColumnName("DrugName").HasMaxLength(1000);
            builder.Property(x => x.MedicationRouteCode).HasColumnName("MedicationRouteCode").HasMaxLength(10);
            builder.Property(x => x.ICDCode).HasColumnName("ICDCode").HasMaxLength(1000);
            builder.Property(x => x.TotalQuantity).HasColumnName("TotalQuantity");
            builder.Property(x => x.NoOfDays).HasColumnName("NoOfDays");
            builder.Property(x => x.Morning).HasColumnName("Morning");
            builder.Property(x => x.Brunch).HasColumnName("Brunch");
            builder.Property(x => x.Noon).HasColumnName("Noon");
            builder.Property(x => x.Evening).HasColumnName("Evening");
            builder.Property(x => x.Night).HasColumnName("Night");
            builder.Property(x => x.Before).HasColumnName("Before");
            builder.Property(x => x.After).HasColumnName("After");
            builder.Property(x => x.Start).HasColumnName("Start");
            builder.Property(x => x.Hold).HasColumnName("Hold");
            builder.Property(x => x.Continued).HasColumnName("Continued");
            builder.Property(x => x.DisContinue).HasColumnName("DisContinue");
            builder.Property(x => x.SIG).HasColumnName("SIG").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.Modifiedby).HasColumnName("ModifiedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
        }
    }
}
