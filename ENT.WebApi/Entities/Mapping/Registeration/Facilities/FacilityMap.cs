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
    public class FacilityMap : IEntityTypeConfiguration<Facility>
    {
        public void Configure(EntityTypeBuilder<Facility> builder)
        {
            builder.ToTable("Facility", "dbo");
            builder.HasKey(x => x.FacilityId);

            builder.Property(x => x.FacilityId).HasColumnName("FacilityId");
            builder.Property(x => x.FacilityName).HasColumnName("FacilityName").HasMaxLength(50);
            builder.Property(x => x.FacilityNumber).HasColumnName("FacilityNumber").HasMaxLength(50);
            builder.Property(x => x.SpecialityId).HasColumnName("SpecialityId").HasMaxLength(100);
            builder.Property(x => x.AddressLine1).HasColumnName("AddressLine1").HasMaxLength(50);
            builder.Property(x => x.AddressLine2).HasColumnName("AddressLine2").HasMaxLength(50);
            builder.Property(x => x.City).HasColumnName("City").HasMaxLength(50);
            builder.Property(x => x.State).HasColumnName("State").HasMaxLength(50);
            builder.Property(x => x.Country).HasColumnName("Country").HasMaxLength(50);
            builder.Property(x => x.PINCode).HasColumnName("PINCode").HasMaxLength(10);
            builder.Property(x => x.Telephone).HasColumnName("Telephone").HasMaxLength(50);
            builder.Property(x => x.AlternativeTelphone).HasColumnName("AlternativeTelphone").HasMaxLength(50);
            builder.Property(x => x.Email).HasColumnName("Email").HasMaxLength(50);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
