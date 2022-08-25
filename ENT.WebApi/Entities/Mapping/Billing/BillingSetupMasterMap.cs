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
    public class BillingSetupMasterMap : IEntityTypeConfiguration<BillingSetupMaster>
    {
        public void Configure(EntityTypeBuilder<BillingSetupMaster> builder)
        {
            builder.ToTable("BillingSetupMaster", "Master");
            builder.HasKey(x => x.SetupMasterID);

            builder.Property(x => x.SetupMasterID).HasColumnName("SetupMasterID");
            builder.Property(x => x.DepartmentID).HasColumnName("DepartmentID");
            builder.Property(x => x.MasterBillingType).HasColumnName("MasterBillingType");
            builder.Property(x => x.SubMasterBillingType).HasColumnName("SubMasterBillingType").HasMaxLength(50);
            builder.Property(x => x.Status).HasColumnName("Status").HasMaxLength(20);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.AcceptedPaymentMode).HasColumnName("AcceptedPaymentMode").HasMaxLength(20);
            builder.Property(x => x.AllowDiscount).HasColumnName("AllowDiscount");
            builder.Property(x => x.AllowPartialPayment).HasColumnName("AllowPartialPayment");
            builder.Property(x => x.UserTypeBilling).HasColumnName("UserTypeBilling");
            builder.Property(x => x.UserType).HasColumnName("UserType").HasMaxLength(10);
            builder.Property(x => x.Charges).HasColumnName("Charges");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
