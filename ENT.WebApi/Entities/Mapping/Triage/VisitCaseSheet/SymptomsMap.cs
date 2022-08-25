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
    public class SymptomsMap : IEntityTypeConfiguration<Symptoms>
    {
        public void Configure(EntityTypeBuilder<Symptoms> builder)
        {
            builder.ToTable("Symptoms", "Master");
            builder.HasKey(x => x.SymptomsId);

            builder.Property(x => x.SymptomsId).HasColumnName("SymptomsId");
            builder.Property(x => x.SymptomsCode).HasColumnName("SymptomsCode");
            builder.Property(x => x.SymptomsDescription).HasColumnName("SymptomsDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
