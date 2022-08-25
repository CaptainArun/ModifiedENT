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
    public class PatientImmunizationMap : IEntityTypeConfiguration<PatientImmunization>
    {
        public void Configure(EntityTypeBuilder<PatientImmunization> builder)
        {
            builder.ToTable("PatientImmunization", "dbo");
            builder.HasKey(x => x.ImmunizationID);

            builder.Property(x => x.ImmunizationID).HasColumnName("ImmunizationID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.ImmunizationDate).HasColumnName("ImmunizationDate");
            builder.Property(x => x.InjectingPhysician).HasColumnName("InjectingPhysician").HasMaxLength(50);
            builder.Property(x => x.VaccineName).HasColumnName("VaccineName").HasMaxLength(50);
            builder.Property(x => x.ProductName).HasColumnName("ProductName").HasMaxLength(50);
            builder.Property(x => x.Manufacturer).HasColumnName("Manufacturer").HasMaxLength(50);
            builder.Property(x => x.BatchNo).HasColumnName("BatchNo").HasMaxLength(15);
            builder.Property(x => x.Route).HasColumnName("Route").HasMaxLength(50);
            builder.Property(x => x.BodySite).HasColumnName("BodySite").HasMaxLength(50);
            builder.Property(x => x.DoseUnits).HasColumnName("DoseUnits").HasMaxLength(10);
            builder.Property(x => x.FacilityName).HasColumnName("FacilityName").HasMaxLength(50);
            builder.Property(x => x.PatientAge).HasColumnName("PatientAge");
            builder.Property(x => x.Notes).HasColumnName("Notes").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
