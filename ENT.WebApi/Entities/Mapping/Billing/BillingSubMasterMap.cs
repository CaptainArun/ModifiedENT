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
    public class BillingSubMasterMap : IEntityTypeConfiguration<BillingSubMaster>
    {
        public void Configure(EntityTypeBuilder<BillingSubMaster> builder)
        {
            builder.ToTable("BillingSubMaster", "Master");
            builder.HasKey(x => x.BillingSubMasterID);

            builder.Property(x => x.BillingSubMasterID).HasColumnName("BillingSubMasterID");
            builder.Property(x => x.DepartmentID).HasColumnName("DepartmentID");
            builder.Property(x => x.MasterBillingType).HasColumnName("MasterBillingType");
            builder.Property(x => x.SubMasterBillingType).HasColumnName("SubMasterBillingType").HasMaxLength(50);
            builder.Property(x => x.SubMasterBillingTypeDesc).HasColumnName("SubMasterBillingTypeDesc").HasMaxLength(100);
            builder.Property(x => x.Status).HasColumnName("Status").HasMaxLength(20);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
