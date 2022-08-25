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
    public class eLabRequestMap : IEntityTypeConfiguration<eLabRequest>
    {
        public void Configure(EntityTypeBuilder<eLabRequest> builder)
        {
            builder.ToTable("eLabRequest", "dbo");
            builder.HasKey(x => x.LabRequestID);

            builder.Property(x => x.LabRequestID).HasColumnName("LabRequestID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.AdmissionID).HasColumnName("AdmissionID");
            builder.Property(x => x.LabOrderStatus).HasColumnName("LabOrderStatus").HasMaxLength(20);
            builder.Property(x => x.RequestedDate).HasColumnName("RequestedDate");
            builder.Property(x => x.RequestedBy).HasColumnName("RequestedBy").HasMaxLength(50);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
