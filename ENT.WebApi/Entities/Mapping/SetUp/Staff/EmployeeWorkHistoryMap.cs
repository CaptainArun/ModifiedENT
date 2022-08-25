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
    public class EmployeeWorkHistoryMap : IEntityTypeConfiguration<EmployeeWorkHistory>
    {
        public void Configure(EntityTypeBuilder<EmployeeWorkHistory> builder)
        {
            builder.ToTable("EmployeeWorkHistory", "dbo");
            builder.HasKey(x => x.EmployeeWorkHistoryId);

            builder.Property(x => x.EmployeeWorkHistoryId).HasColumnName("EmployeeWorkHistoryId");
            builder.Property(x => x.EmployeeID).HasColumnName("EmployeeID");
            builder.Property(x => x.EmployerName).HasColumnName("EmployerName").HasMaxLength(50);
            builder.Property(x => x.ContactPerson).HasColumnName("ContactPerson").HasMaxLength(50);
            builder.Property(x => x.EMail).HasColumnName("EMail").HasMaxLength(40);
            builder.Property(x => x.CellNo).HasColumnName("CellNo").HasMaxLength(20);
            builder.Property(x => x.PhoneNo).HasColumnName("PhoneNo").HasMaxLength(20);
            builder.Property(x => x.Address1).HasColumnName("Address1").HasMaxLength(100);
            builder.Property(x => x.Address2).HasColumnName("Address2").HasMaxLength(100);
            builder.Property(x => x.Town).HasColumnName("Town").HasMaxLength(50);
            builder.Property(x => x.City).HasColumnName("City").HasMaxLength(50);
            builder.Property(x => x.District).HasColumnName("District").HasMaxLength(50);
            builder.Property(x => x.State).HasColumnName("State").HasMaxLength(50);
            builder.Property(x => x.Country).HasColumnName("Country").HasMaxLength(50);
            builder.Property(x => x.Pincode).HasColumnName("Pincode").HasMaxLength(10);
            builder.Property(x => x.FromDate).HasColumnName("FromDate");
            builder.Property(x => x.ToDate).HasColumnName("ToDate");
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(200);
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
