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
    public class eLabOrderItemsMap : IEntityTypeConfiguration<eLabOrderItems>
    {
        public void Configure(EntityTypeBuilder<eLabOrderItems> builder)
        {
            builder.ToTable("eLabOrderItems", "dbo");
            builder.HasKey(x => x.LabOrderItemsID);

            builder.Property(x => x.LabOrderItemsID).HasColumnName("LabOrderItemsID");
            builder.Property(x => x.LabOrderID).HasColumnName("LabOrderID");
            builder.Property(x => x.SetupMasterID).HasColumnName("SetupMasterID");
            builder.Property(x => x.UrgencyCode).HasColumnName("UrgencyCode").HasMaxLength(10);
            builder.Property(x => x.LabOnDate).HasColumnName("LabOnDate");
            builder.Property(x => x.LabNotes).HasColumnName("LabNotes").HasMaxLength(1000);
            builder.Property(x => x.Value).HasColumnName("Value").HasMaxLength(50);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
