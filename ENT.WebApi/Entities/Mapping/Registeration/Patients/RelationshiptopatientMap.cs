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
    public class RelationshiptopatientMap : IEntityTypeConfiguration<Relationshiptopatient>
    {
        public void Configure(EntityTypeBuilder<Relationshiptopatient> builder)
        {
            builder.ToTable("Relationshiptopatient", "Master");
            builder.HasKey(x => x.RSPId);

            builder.Property(x => x.RSPId).HasColumnName("RSPId");
            builder.Property(x => x.RSPCode).HasColumnName("RSPCode").HasMaxLength(10);
            builder.Property(x => x.RSPDescription).HasColumnName("RSPDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
