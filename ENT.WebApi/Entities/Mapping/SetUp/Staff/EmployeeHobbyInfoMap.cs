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
    public class EmployeeHobbyInfoMap : IEntityTypeConfiguration<EmployeeHobbyInfo>
    {
        public void Configure(EntityTypeBuilder<EmployeeHobbyInfo> builder)
        {
            builder.ToTable("EmployeeHobbyInfo", "dbo");
            builder.HasKey(x => x.EmployeeHobbyId);

            builder.Property(x => x.EmployeeHobbyId).HasColumnName("EmployeeHobbyId");
            builder.Property(x => x.EmployeeID).HasColumnName("EmployeeID");
            builder.Property(x => x.ActivityType).HasColumnName("ActivityType");
            builder.Property(x => x.Details).HasColumnName("Details").HasMaxLength(250);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
