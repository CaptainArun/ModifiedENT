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
    public class MedicationsMap : IEntityTypeConfiguration<Medications>
    {
        public void Configure(EntityTypeBuilder<Medications> builder)
        {
            builder.ToTable("Medications", "dbo");
            builder.HasKey(x => x.MedicationId);

            builder.Property(x => x.MedicationId).HasColumnName("MedicationId");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.AdmissionID).HasColumnName("AdmissionID");
            builder.Property(x => x.MedicationPhysician).HasColumnName("MedicationPhysician");
            builder.Property(x => x.TakeRegularMedication).HasColumnName("TakeRegularMedication");
            builder.Property(x => x.IsHoldRegularMedication).HasColumnName("IsHoldRegularMedication");
            builder.Property(x => x.HoldRegularMedicationNotes).HasColumnName("HoldRegularMedicationNotes").HasMaxLength(500);
            builder.Property(x => x.IsDiscontinueDrug).HasColumnName("IsDiscontinueDrug");
            builder.Property(x => x.DiscontinueDrugNotes).HasColumnName("DiscontinueDrugNotes").HasMaxLength(500);
            builder.Property(x => x.IsPharmacist).HasColumnName("IsPharmacist");
            builder.Property(x => x.PharmacistNotes).HasColumnName("PharmacistNotes").HasMaxLength(500);
            builder.Property(x => x.IsRefill).HasColumnName("IsRefill");
            builder.Property(x => x.RefillCount).HasColumnName("RefillCount");
            builder.Property(x => x.RefillDate).HasColumnName("RefillDate");
            builder.Property(x => x.RefillNotes).HasColumnName("RefillNotes").HasMaxLength(500);
            builder.Property(x => x.MedicationStatus).HasColumnName("MedicationStatus").HasMaxLength(20);
            builder.Property(x => x.MedicationNumber).HasColumnName("MedicationNumber").HasMaxLength(15);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
