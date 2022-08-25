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
    public class BillingMasterMap : IEntityTypeConfiguration<BillingMaster>
    {
        public void Configure(EntityTypeBuilder<BillingMaster> builder)
        {
            builder.ToTable("BillingMaster", "Master");
            builder.HasKey(x => x.BillingMasterID);

            builder.Property(x => x.BillingMasterID).HasColumnName("BillingMasterID");
            builder.Property(x => x.DepartmentID).HasColumnName("DepartmentID");
            builder.Property(x => x.MasterBillingType).HasColumnName("MasterBillingType").HasMaxLength(25);
            builder.Property(x => x.BillingTypeDesc).HasColumnName("BillingTypeDesc").HasMaxLength(100);
            builder.Property(x => x.Status).HasColumnName("Status").HasMaxLength(20);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.AllowSubMaster).HasColumnName("AllowSubMaster");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
