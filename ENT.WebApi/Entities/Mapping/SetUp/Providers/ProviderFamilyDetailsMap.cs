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
    public class ProviderFamilyDetailsMap : IEntityTypeConfiguration<ProviderFamilyDetails>
    {
        public void Configure(EntityTypeBuilder<ProviderFamilyDetails> builder)
        {
            builder.ToTable("ProviderFamilyDetails", "dbo");
            builder.HasKey(x => x.ProviderFamilyDetailId);

            builder.Property(x => x.ProviderFamilyDetailId).HasColumnName("ProviderFamilyDetailId");
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.FullName).HasColumnName("FullName").HasMaxLength(50);
            builder.Property(x => x.Age).HasColumnName("Age");
            builder.Property(x => x.RelationShip).HasColumnName("RelationShip").HasMaxLength(50);
            builder.Property(x => x.Occupation).HasColumnName("Occupation").HasMaxLength(50);
            builder.Property(x => x.Notes).HasColumnName("Notes").HasMaxLength(500);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
