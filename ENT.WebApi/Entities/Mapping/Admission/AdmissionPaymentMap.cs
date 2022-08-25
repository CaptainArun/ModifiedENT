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
    public class AdmissionPaymentMap : IEntityTypeConfiguration<AdmissionPayment>
    {
        public void Configure(EntityTypeBuilder<AdmissionPayment> builder)
        {
            builder.ToTable("AdmissionPayment", "dbo");
            builder.HasKey(x => x.AdmissionPaymentID);

            builder.Property(x => x.AdmissionPaymentID).HasColumnName("AdmissionPaymentID");
            builder.Property(x => x.AdmissionID).HasColumnName("AdmissionID");
            builder.Property(x => x.ReceiptNo).HasColumnName("ReceiptNo").HasMaxLength(10);
            builder.Property(x => x.ReceiptDate).HasColumnName("ReceiptDate");
            builder.Property(x => x.BillNo).HasColumnName("BillNo").HasMaxLength(10);
            builder.Property(x => x.MiscAmount).HasColumnName("MiscAmount");
            builder.Property(x => x.DiscountPercentage).HasColumnName("DiscountPercentage");
            builder.Property(x => x.DiscountAmount).HasColumnName("DiscountAmount");
            builder.Property(x => x.GrandTotal).HasColumnName("GrandTotal");
            builder.Property(x => x.NetAmount).HasColumnName("NetAmount");
            builder.Property(x => x.PaidAmount).HasColumnName("PaidAmount");
            builder.Property(x => x.PaymentMode).HasColumnName("PaymentMode").HasMaxLength(25);
            builder.Property(x => x.Notes).HasColumnName("Notes").HasMaxLength(1000);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
