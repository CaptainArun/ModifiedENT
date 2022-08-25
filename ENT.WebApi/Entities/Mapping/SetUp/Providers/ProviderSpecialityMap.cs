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
    public class ProviderSpecialityMap : IEntityTypeConfiguration<ProviderSpeciality>
    {
        public void Configure(EntityTypeBuilder<ProviderSpeciality> builder)
        {
            builder.ToTable("ProviderSpeciality", "dbo");
            builder.HasKey(x => x.ProviderSpecialtyID);

            builder.Property(x => x.ProviderSpecialtyID).HasColumnName("ProviderSpecialtyID");
            builder.Property(x => x.SpecialityID).HasColumnName("SpecialityID");
            builder.Property(x => x.SpecialityCode).HasColumnName("SpecialityCode").HasMaxLength(50);
            builder.Property(x => x.SpecialityDescription).HasColumnName("SpecialityDescription").HasMaxLength(500);
            builder.Property(x => x.EffectiveDate).HasColumnName("EffectiveDate");
            builder.Property(x => x.TerminationDate).HasColumnName("TerminationDate");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
        }
    }
}
