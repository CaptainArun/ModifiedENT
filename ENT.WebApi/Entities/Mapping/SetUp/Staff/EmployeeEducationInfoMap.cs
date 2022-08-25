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
    public class EmployeeEducationInfoMap : IEntityTypeConfiguration<EmployeeEducationInfo>
    {
        public void Configure(EntityTypeBuilder<EmployeeEducationInfo> builder)
        {
            builder.ToTable("EmployeeEducationInfo", "dbo");
            builder.HasKey(x => x.EmployeeEducationID);

            builder.Property(x => x.EmployeeEducationID).HasColumnName("EmployeeEducationID");
            builder.Property(x => x.EmployeeID).HasColumnName("EmployeeID");
            builder.Property(x => x.University).HasColumnName("University").HasMaxLength(100);
            builder.Property(x => x.Month).HasColumnName("Month");
            builder.Property(x => x.Year).HasColumnName("Year");
            builder.Property(x => x.InstituteName).HasColumnName("InstituteName").HasMaxLength(100);
            builder.Property(x => x.Percentage).HasColumnName("Percentage").HasMaxLength(10);
            builder.Property(x => x.Branch).HasColumnName("Branch").HasMaxLength(100);
            builder.Property(x => x.MainSubject).HasColumnName("MainSubject").HasMaxLength(100);
            builder.Property(x => x.Scholorship).HasColumnName("Scholorship").HasMaxLength(200);
            builder.Property(x => x.Qualification).HasColumnName("Qualification").HasMaxLength(100);
            builder.Property(x => x.Duration).HasColumnName("Duration").HasMaxLength(25);
            builder.Property(x => x.PlaceOfInstitute).HasColumnName("PlaceOfInstitute").HasMaxLength(100);
            builder.Property(x => x.RegistrationAuthority).HasColumnName("RegistrationAuthority").HasMaxLength(100);
            builder.Property(x => x.RegistrationNo).HasColumnName("RegistrationNo").HasMaxLength(25);
            builder.Property(x => x.RegistrationExpiryDate).HasColumnName("RegistrationExpiryDate");
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(200);
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);

        }
    }
}
