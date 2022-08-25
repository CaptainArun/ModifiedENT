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
    public class VisitPaymentDetailsMap : IEntityTypeConfiguration<VisitPaymentDetails>
    {
        public void Configure(EntityTypeBuilder<VisitPaymentDetails> builder)
        {
            builder.ToTable("VisitPaymentDetails", "dbo");
            builder.HasKey(x => x.VisitPaymentDetailsID);

            builder.Property(x => x.VisitPaymentDetailsID).HasColumnName("VisitPaymentDetailsID");
            builder.Property(x => x.VisitPaymentID).HasColumnName("VisitPaymentID");
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
