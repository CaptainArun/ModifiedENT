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
    public class SpecialityMap : IEntityTypeConfiguration<Speciality>
    {
        public void Configure(EntityTypeBuilder<Speciality> builder)
        {
            builder.ToTable("Speciality", "Master");
            builder.HasKey(x => x.SpecialityID);

            builder.Property(x => x.SpecialityID).HasColumnName("SpecialityID");
            builder.Property(x => x.CategoryID).HasColumnName("CategoryID");
            builder.Property(x => x.SpecialityCode).HasColumnName("SpecialityCode").HasMaxLength(20);
            builder.Property(x => x.SpecialityDescription).HasColumnName("SpecialityDescription").HasMaxLength(200);
            builder.Property(x => x.GroupID).HasColumnName("GroupID");
            builder.Property(x => x.Deleted).HasColumnName("Deleted");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(20);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(20);
        }
    }
}
