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
    public class RequestedProcedureMap : IEntityTypeConfiguration<RequestedProcedure>
    {
        public void Configure(EntityTypeBuilder<RequestedProcedure> builder)
        {
            builder.ToTable("RequestedProcedure", "Master");
            builder.HasKey(x => x.RequestedProcedureId);

            builder.Property(x => x.RequestedProcedureId).HasColumnName("RequestedProcedureId");
            builder.Property(x => x.RequestedProcedureCode).HasColumnName("RequestedProcedureCode");
            builder.Property(x => x.RequestedProcedureDescription).HasColumnName("RequestedProcedureDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
