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
    public class ProviderContactMap : IEntityTypeConfiguration<ProviderContact>
    {
        public void Configure(EntityTypeBuilder<ProviderContact> builder)
        {
            builder.ToTable("ProviderContact", "dbo");
            builder.HasKey(x => x.ProviderContactID);

            builder.Property(x => x.ProviderContactID).HasColumnName("ProviderContactID");
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.CellNumber).HasColumnName("CellNumber").HasMaxLength(20);
            builder.Property(x => x.PhoneNumber).HasColumnName("PhoneNumber").HasMaxLength(20);
            builder.Property(x => x.WhatsAppNumber).HasColumnName("WhatsAppNumber").HasMaxLength(20);
            builder.Property(x => x.EmergencyContactNumber).HasColumnName("EmergencyContactNumber").HasMaxLength(20);
            builder.Property(x => x.Fax).HasColumnName("Fax").HasMaxLength(20);
            builder.Property(x => x.Email).HasColumnName("Email").HasMaxLength(50);
            builder.Property(x => x.TelephoneNo).HasColumnName("TelephoneNo").HasMaxLength(20);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
