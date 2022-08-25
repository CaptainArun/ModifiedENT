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
    public class ProviderAddressMap : IEntityTypeConfiguration<ProviderAddress>
    {
        public void Configure(EntityTypeBuilder<ProviderAddress> builder)
        {
            builder.ToTable("ProviderAddress", "dbo");
            builder.HasKey(x => x.ProviderAddressID);

            builder.Property(x => x.ProviderAddressID).HasColumnName("ProviderAddressID");
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.AddressType).HasColumnName("AddressType").HasMaxLength(30);
            builder.Property(x => x.DoorOrApartmentNo).HasColumnName("DoorOrApartmentNo").HasMaxLength(20);
            builder.Property(x => x.ApartmentNameOrHouseName).HasColumnName("ApartmentNameOrHouseName").HasMaxLength(100);
            builder.Property(x => x.StreetName).HasColumnName("StreetName").HasMaxLength(50);
            builder.Property(x => x.Locality).HasColumnName("Locality").HasMaxLength(50);
            builder.Property(x => x.Town).HasColumnName("Town").HasMaxLength(50);
            builder.Property(x => x.District).HasColumnName("District").HasMaxLength(50);
            builder.Property(x => x.City).HasColumnName("City").HasMaxLength(50);
            builder.Property(x => x.State).HasColumnName("State").HasMaxLength(50);
            builder.Property(x => x.Country).HasColumnName("Country").HasMaxLength(50);
            builder.Property(x => x.PinCode).HasColumnName("PinCode");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
