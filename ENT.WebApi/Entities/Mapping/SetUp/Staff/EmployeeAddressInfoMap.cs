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
    public class EmployeeAddressInfoMap : IEntityTypeConfiguration<EmployeeAddressInfo>
    {
        public void Configure(EntityTypeBuilder<EmployeeAddressInfo> builder)
        {
            builder.ToTable("EmployeeAddressInfo", "dbo");
            builder.HasKey(x => x.EmployeeAddressId);

            builder.Property(x => x.EmployeeAddressId).HasColumnName("EmployeeAddressId");
            builder.Property(x => x.EmployeeID).HasColumnName("EmployeeID");
            builder.Property(x => x.AddressType).HasColumnName("AddressType");
            builder.Property(x => x.Address1).HasColumnName("Address1").HasMaxLength(100);
            builder.Property(x => x.Address2).HasColumnName("Address2").HasMaxLength(100);
            builder.Property(x => x.City).HasColumnName("City").HasMaxLength(50);
            builder.Property(x => x.District).HasColumnName("District").HasMaxLength(50);
            builder.Property(x => x.Pincode).HasColumnName("Pincode").HasMaxLength(10);
            builder.Property(x => x.State).HasColumnName("State").HasMaxLength(50);
            builder.Property(x => x.Country).HasColumnName("Country").HasMaxLength(50);
            builder.Property(x => x.ValidFrom).HasColumnName("ValidFrom");
            builder.Property(x => x.ValidTo).HasColumnName("ValidTo");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
