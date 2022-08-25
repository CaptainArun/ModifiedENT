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
    public class OPDNursingMedicationMap : IEntityTypeConfiguration<OPDNursingMedication>
    {
        public void Configure(EntityTypeBuilder<OPDNursingMedication> builder)
        {
            builder.ToTable("OPDNursingMedication", "dbo");
            builder.HasKey(x => x.NursingMedicationID);

            builder.Property(x => x.NursingMedicationID).HasColumnName("NursingMedicationID");
            builder.Property(x => x.OPDNOId).HasColumnName("OPDNOId");
            builder.Property(x => x.Drugname).HasColumnName("Drugname").HasMaxLength(50);
            builder.Property(x => x.DispenseformId).HasColumnName("DispenseformId");
            builder.Property(x => x.SelectedDiagnosis).HasColumnName("SelectedDiagnosis").HasMaxLength(100);
            builder.Property(x => x.Quantity).HasColumnName("Quantity");
            builder.Property(x => x.MedicationTime).HasColumnName("MedicationTime").HasMaxLength(50);
            builder.Property(x => x.After).HasColumnName("After");
            builder.Property(x => x.Before).HasColumnName("Before");
            builder.Property(x => x.DoneBy).HasColumnName("DoneBy").HasMaxLength(50);
            builder.Property(x => x.SIGNotes).HasColumnName("SIGNotes").HasMaxLength(50);
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
