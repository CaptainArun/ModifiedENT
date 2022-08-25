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
    public class EmployeeCampusMap : IEntityTypeConfiguration<EmployeeCampus>
    {
        public void Configure(EntityTypeBuilder<EmployeeCampus> builder)
        {
            builder.ToTable("EmployeeCampus", "dbo");
            builder.HasKey(x => x.EmployeeCampusId);

            builder.Property(x => x.EmployeeCampusId).HasColumnName("EmployeeCampusId");
            builder.Property(x => x.EmployeeID).HasColumnName("EmployeeID");
            builder.Property(x => x.Name).HasColumnName("Name").HasMaxLength(100);
            builder.Property(x => x.CampusDate).HasColumnName("CampusDate");
            builder.Property(x => x.Details).HasColumnName("Details").HasMaxLength(100);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
