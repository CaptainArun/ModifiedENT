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
    public class ProviderMap : IEntityTypeConfiguration<Provider>
    {
        public void Configure(EntityTypeBuilder<Provider> builder)
        {
            builder.ToTable("Provider", "dbo");
            builder.HasKey(x => x.ProviderID);

            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.UserID).HasColumnName("UserID").HasMaxLength(40);
            builder.Property(x => x.FacilityId).HasColumnName("FacilityId").HasMaxLength(100);
            builder.Property(x => x.RoleId).HasColumnName("RoleId");
            builder.Property(x => x.FirstName).HasColumnName("FirstName").HasMaxLength(50);
            builder.Property(x => x.MiddleName).HasColumnName("MiddleName").HasMaxLength(25);
            builder.Property(x => x.LastName).HasColumnName("LastName").HasMaxLength(50);
            builder.Property(x => x.NamePrefix).HasColumnName("NamePrefix").HasMaxLength(25);
            builder.Property(x => x.NameSuffix).HasColumnName("NameSuffix").HasMaxLength(25);
            builder.Property(x => x.Title).HasColumnName("Title").HasMaxLength(50);
            builder.Property(x => x.BirthDate).HasColumnName("BirthDate");
            builder.Property(x => x.Gender).HasColumnName("Gender").HasMaxLength(15);
            builder.Property(x => x.PersonalEmail).HasColumnName("PersonalEmail").HasMaxLength(50);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Language).HasColumnName("Language").HasMaxLength(15);
            builder.Property(x => x.PreferredLanguage).HasColumnName("PreferredLanguage").HasMaxLength(15);
            builder.Property(x => x.MotherMaiden).HasColumnName("MotherMaiden").HasMaxLength(50);
            builder.Property(x => x.WebSiteName).HasColumnName("WebSiteName").HasMaxLength(50);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
