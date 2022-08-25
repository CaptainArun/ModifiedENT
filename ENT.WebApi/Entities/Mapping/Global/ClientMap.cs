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
    public class ClientMap : IEntityTypeConfiguration<Client>
    {
        public void Configure(EntityTypeBuilder<Client> builder)
        {
            builder.ToTable("Client", "dbo");
            builder.HasKey(x => x.ClientID);

            builder.Property(x => x.ClientID).HasColumnName("ClientID");
            builder.Property(x => x.ClientName).HasColumnName("ClientName").HasMaxLength(200);
            builder.Property(x => x.DisplayName).HasColumnName("DisplayName").HasMaxLength(250);
            builder.Property(x => x.ShortName).HasColumnName("ShortName").HasMaxLength(100);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(20);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(20);
        }
    }
}
