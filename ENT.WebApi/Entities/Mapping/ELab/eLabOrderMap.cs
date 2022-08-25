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
    public class eLabOrderMap : IEntityTypeConfiguration<eLabOrder>
    {
        public void Configure(EntityTypeBuilder<eLabOrder> builder)
        {
            builder.ToTable("eLabOrder", "dbo");
            builder.HasKey(x => x.LabOrderID);

            builder.Property(x => x.LabOrderID).HasColumnName("LabOrderID");
            builder.Property(x => x.LabOrderNo).HasColumnName("LabOrderNo").HasMaxLength(20);
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.AdmissionID).HasColumnName("AdmissionID");
            builder.Property(x => x.LabPhysician).HasColumnName("LabPhysician");
            builder.Property(x => x.SignOff).HasColumnName("SignOff");
            builder.Property(x => x.SignOffDate).HasColumnName("SignOffDate");
            builder.Property(x => x.SignOffBy).HasColumnName("SignOffBy").HasMaxLength(50);
            builder.Property(x => x.LabOrderStatus).HasColumnName("LabOrderStatus").HasMaxLength(20);
            builder.Property(x => x.RequestedFrom).HasColumnName("RequestedFrom").HasMaxLength(20);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
