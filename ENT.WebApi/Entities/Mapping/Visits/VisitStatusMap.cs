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
    public class VisitStatusMap : IEntityTypeConfiguration<VisitStatus>
    {
        public void Configure(EntityTypeBuilder<VisitStatus> builder)
        {
            builder.ToTable("VisitStatus", "Master");
            builder.HasKey(x => x.VisitStatusId);

            builder.Property(x => x.VisitStatusId).HasColumnName("VisitStatusId");
            builder.Property(x => x.VisitStatusCode).HasColumnName("VisitStatusCode").HasMaxLength(10);
            builder.Property(x => x.VisitStatusDescription).HasColumnName("VisitStatusDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
