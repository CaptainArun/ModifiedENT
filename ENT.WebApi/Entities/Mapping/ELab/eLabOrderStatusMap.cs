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
    public class eLabOrderStatusMap : IEntityTypeConfiguration<eLabOrderStatus>
    {
        public void Configure(EntityTypeBuilder<eLabOrderStatus> builder)
        {
            builder.ToTable("eLabOrderStatus", "dbo");
            builder.HasKey(x => x.eLabOrderStatusId);

            builder.Property(x => x.eLabOrderStatusId).HasColumnName("eLabOrderStatusId");
            builder.Property(x => x.eLabOrderId).HasColumnName("eLabOrderId");
            builder.Property(x => x.SampleCollectedDate).HasColumnName("SampleCollectedDate");
            builder.Property(x => x.ReportDate).HasColumnName("ReportDate");
            builder.Property(x => x.ReportStatus).HasColumnName("ReportStatus").HasMaxLength(20);
            builder.Property(x => x.ApprovedBy).HasColumnName("ApprovedBy");
            builder.Property(x => x.SignOffBy).HasColumnName("SignOffBy").HasMaxLength(50);
            builder.Property(x => x.SignOffStatus).HasColumnName("SignOffStatus");
            builder.Property(x => x.SignOffDate).HasColumnName("SignOffDate");
            builder.Property(x => x.Notes).HasColumnName("Notes").HasMaxLength(500);
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
