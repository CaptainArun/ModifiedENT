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
    public class AspNetUsersMap : IEntityTypeConfiguration<AspNetUsers>
    {
        public void Configure(EntityTypeBuilder<AspNetUsers> builder)
        {
            builder.ToTable("AspNetUsers", "dbo");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).HasColumnName("Id").HasMaxLength(450);
            builder.Property(x => x.UserName).HasColumnName("UserName").HasMaxLength(256);
            builder.Property(x => x.NormalizedUserName).HasColumnName("NormalizedUserName").HasMaxLength(256);
            builder.Property(x => x.Email).HasColumnName("Email").HasMaxLength(256);
            builder.Property(x => x.NormalizedEmail).HasColumnName("NormalizedEmail").HasMaxLength(256);
            builder.Property(x => x.EmailConfirmed).HasColumnName("EmailConfirmed").HasColumnType("bit");
            builder.Property(x => x.PasswordHash).HasColumnName("PasswordHash").HasMaxLength(2000);
            builder.Property(x => x.SecurityStamp).HasColumnName("SecurityStamp").HasMaxLength(2000);
            builder.Property(x => x.ConcurrencyStamp).HasColumnName("ConcurrencyStamp").HasMaxLength(2000);
            builder.Property(x => x.PhoneNumber).HasColumnName("PhoneNumber").HasMaxLength(2000);
            builder.Property(x => x.PhoneNumberConfirmed).HasColumnName("PhoneNumberConfirmed").HasColumnType("bit");
            builder.Property(x => x.TwoFactorEnabled).HasColumnName("TwoFactorEnabled").HasColumnType("bit");
            builder.Property(x => x.LockoutEnd).HasColumnName("LockoutEnd").HasColumnType("datetimeoffset(7)");
            builder.Property(x => x.LockoutEnabled).HasColumnName("LockoutEnabled").HasColumnType("bit");
            builder.Property(x => x.AccessFailedCount).HasColumnName("AccessFailedCount");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(2000);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate").HasColumnType("datetime2(7)"); 
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(2000);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate").HasColumnType("datetime2(7)");
            builder.Property(x => x.isActive).HasColumnName("isActive").HasColumnType("bit");
        }           
    }
}
