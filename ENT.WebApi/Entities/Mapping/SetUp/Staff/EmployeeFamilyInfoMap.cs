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
    public class EmployeeFamilyInfoMap : IEntityTypeConfiguration<EmployeeFamilyInfo>
    {
        public void Configure(EntityTypeBuilder<EmployeeFamilyInfo> builder)
        {
            builder.ToTable("EmployeeFamilyInfo", "dbo");
            builder.HasKey(x => x.EmployeeFamilyID);

            builder.Property(x => x.EmployeeFamilyID).HasColumnName("EmployeeFamilyID");
            builder.Property(x => x.EmployeeID).HasColumnName("EmployeeID");
            builder.Property(x => x.Salutation).HasColumnName("Salutation");
            builder.Property(x => x.FirstName).HasColumnName("FirstName").HasMaxLength(50);
            builder.Property(x => x.MiddleName).HasColumnName("MiddleName").HasMaxLength(50);
            builder.Property(x => x.LastName).HasColumnName("LastName").HasMaxLength(50);
            builder.Property(x => x.Gender).HasColumnName("Gender");
            builder.Property(x => x.Age).HasColumnName("Age");
            builder.Property(x => x.CellNo).HasColumnName("CellNo").HasMaxLength(20);
            builder.Property(x => x.PhoneNo).HasColumnName("PhoneNo").HasMaxLength(20);
            builder.Property(x => x.WhatsAppNo).HasColumnName("WhatsAppNo").HasMaxLength(20);
            builder.Property(x => x.EMail).HasColumnName("EMail").HasMaxLength(40);
            builder.Property(x => x.RelationshipToEmployee).HasColumnName("RelationshipToEmployee");
            builder.Property(x => x.Occupation).HasColumnName("Occupation").HasMaxLength(50);
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(200);
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
