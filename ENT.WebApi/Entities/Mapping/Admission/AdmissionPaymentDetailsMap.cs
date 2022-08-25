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
    public class AdmissionPaymentDetailsMap : IEntityTypeConfiguration<AdmissionPaymentDetails>
    {
        public void Configure(EntityTypeBuilder<AdmissionPaymentDetails> builder)
        {
            builder.ToTable("AdmissionPaymentDetails", "dbo");
            builder.HasKey(x => x.AdmissionPaymentDetailsID);

            builder.Property(x => x.AdmissionPaymentDetailsID).HasColumnName("AdmissionPaymentDetailsID");
            builder.Property(x => x.AdmissionPaymentID).HasColumnName("AdmissionPaymentID");
            builder.Property(x => x.SetupMasterID).HasColumnName("SetupMasterID");
            builder.Property(x => x.Charges).HasColumnName("Charges");
            builder.Property(x => x.Refund).HasColumnName("Refund");
            builder.Property(x => x.RefundNotes).HasColumnName("RefundNotes").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
